/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0.
 */
package org.apache.flink.cdc.connectors.starrocks.sink;

import org.apache.flink.util.Preconditions;
import org.apache.flink.util.StringUtils;

import com.starrocks.connector.flink.catalog.StarRocksCatalog;
import com.starrocks.connector.flink.catalog.StarRocksCatalogException;
import com.starrocks.connector.flink.catalog.StarRocksColumn;
import com.starrocks.connector.flink.catalog.StarRocksTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/** StarRocks catalog with deterministic, safely escaped schema DDL. */
public class StarRocksEnrichedCatalog extends StarRocksCatalog {

    private static final Logger LOG = LoggerFactory.getLogger(StarRocksEnrichedCatalog.class);

    public StarRocksEnrichedCatalog(String jdbcUrl, String username, String password) {
        super(jdbcUrl, username, password);
    }

    @Override
    public void createTable(StarRocksTable table, boolean ignoreIfExists)
            throws StarRocksCatalogException {
        String sql = buildCreateTableSql(table, ignoreIfExists);
        try {
            executeUpdateStatement(sql);
        } catch (Exception e) {
            throw new StarRocksCatalogException(
                    String.format(
                            "Failed to create table `%s`.`%s`, SQL: %s",
                            table.getDatabaseName(), table.getTableName(), sql),
                    e);
        }
    }

    public void truncateTable(String databaseName, String tableName)
            throws StarRocksCatalogException {
        checkTableArgument(databaseName, tableName);
        executeSchemaChange(
                String.format("TRUNCATE TABLE %s.%s;", identifier(databaseName), identifier(tableName)),
                "truncate table",
                databaseName,
                tableName);
    }

    public void dropTable(String databaseName, String tableName) throws StarRocksCatalogException {
        checkTableArgument(databaseName, tableName);
        executeSchemaChange(
                String.format("DROP TABLE %s.%s;", identifier(databaseName), identifier(tableName)),
                "drop table",
                databaseName,
                tableName);
    }

    public void renameColumn(
            String databaseName, String tableName, String oldColumnName, String newColumnName)
            throws StarRocksCatalogException {
        checkTableArgument(databaseName, tableName);
        executeSchemaChange(
                String.format(
                        "ALTER TABLE %s.%s RENAME COLUMN %s TO %s;",
                        identifier(databaseName),
                        identifier(tableName),
                        identifier(oldColumnName),
                        identifier(newColumnName)),
                "rename column",
                databaseName,
                tableName);
    }

    public void alterColumnType(String databaseName, String tableName, StarRocksColumn column)
            throws StarRocksCatalogException {
        checkTableArgument(databaseName, tableName);
        executeSchemaChange(
                String.format(
                        "ALTER TABLE %s.%s MODIFY COLUMN %s",
                        identifier(databaseName),
                        identifier(tableName),
                        buildColumnStmt(column)),
                "modify column type",
                databaseName,
                tableName);
    }

    private void executeSchemaChange(
            String sql, String operation, String databaseName, String tableName)
            throws StarRocksCatalogException {
        try {
            executeUpdateStatement(sql);
        } catch (Exception e) {
            LOG.error("Failed to {} {}.{}, SQL: {}", operation, databaseName, tableName, sql, e);
            throw new StarRocksCatalogException(
                    String.format("Failed to %s `%s`.`%s`.", operation, databaseName, tableName), e);
        }
    }

    static String buildCreateTableSql(StarRocksTable table, boolean ignoreIfExists) {
        Preconditions.checkArgument(!table.getColumns().isEmpty(), "Columns cannot be empty");
        StringBuilder sql = new StringBuilder("CREATE TABLE ");
        if (ignoreIfExists) {
            sql.append("IF NOT EXISTS ");
        }
        sql.append(identifier(table.getDatabaseName()))
                .append(".")
                .append(identifier(table.getTableName()))
                .append(" (\n")
                .append(
                        table.getColumns().stream()
                                .map(StarRocksEnrichedCatalog::buildColumnStmt)
                                .collect(Collectors.joining(",\n")))
                .append("\n) ")
                .append(table.getTableType().name().replace('_', ' '));

        appendIdentifierList(sql, " (", table.getTableKeys(), ")");
        table.getComment()
                .filter(comment -> !comment.isEmpty())
                .ifPresent(comment -> sql.append("\nCOMMENT ").append(literal(comment)));
        appendIdentifierList(sql, "\nDISTRIBUTED BY HASH (", table.getDistributionKeys(), ")");
        table.getNumBuckets().ifPresent(buckets -> sql.append(" BUCKETS ").append(buckets));

        if (!table.getProperties().isEmpty()) {
            sql.append("\nPROPERTIES (\n")
                    .append(
                            table.getProperties().entrySet().stream()
                                    .map(
                                            entry ->
                                                    literal(entry.getKey())
                                                            + " = "
                                                            + literal(entry.getValue()))
                                    .collect(Collectors.joining(",\n")))
                    .append("\n)");
        }
        return sql.append(";").toString();
    }

    private static void appendIdentifierList(
            StringBuilder sql, String prefix, Optional<List<String>> values, String suffix) {
        values.filter(list -> !list.isEmpty())
                .ifPresent(
                        list ->
                                sql.append(prefix)
                                        .append(
                                                list.stream()
                                                        .map(StarRocksEnrichedCatalog::identifier)
                                                        .collect(Collectors.joining(", ")))
                                        .append(suffix));
    }

    private static String buildColumnStmt(StarRocksColumn column) {
        StringBuilder sql =
                new StringBuilder(identifier(column.getColumnName()))
                        .append(" ")
                        .append(fullColumnType(column))
                        .append(column.isNullable() ? " NULL" : " NOT NULL");
        column.getDefaultValue().ifPresent(value -> sql.append(" DEFAULT ").append(literal(value)));
        column.getColumnComment()
                .filter(comment -> !comment.isEmpty())
                .ifPresent(comment -> sql.append(" COMMENT ").append(literal(comment)));
        return sql.toString();
    }

    private static void checkTableArgument(String databaseName, String tableName) {
        Preconditions.checkArgument(
                !StringUtils.isNullOrWhitespaceOnly(databaseName), "Database name cannot be empty");
        Preconditions.checkArgument(
                !StringUtils.isNullOrWhitespaceOnly(tableName), "Table name cannot be empty");
    }

    private static String fullColumnType(StarRocksColumn column) {
        String type = column.getDataType().toUpperCase();
        switch (type) {
            case "DECIMAL":
                return String.format(
                        "DECIMAL(%d, %d)",
                        column.getColumnSize().orElseThrow(IllegalArgumentException::new),
                        column.getDecimalDigits().orElseThrow(IllegalArgumentException::new));
            case "CHAR":
            case "VARCHAR":
            case "VARBINARY":
                return String.format(
                        "%s(%d)",
                        type, column.getColumnSize().orElseThrow(IllegalArgumentException::new));
            default:
                return type;
        }
    }

    static String identifier(String value) {
        Preconditions.checkArgument(
                !StringUtils.isNullOrWhitespaceOnly(value), "Identifier cannot be empty");
        return "`" + value.replace("`", "``") + "`";
    }

    static String literal(String value) {
        String escaped =
                value.replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\u0000", "\\0")
                        .replace("\b", "\\b")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                        .replace("\t", "\\t")
                        .replace("\u001a", "\\Z");
        return "\"" + escaped + "\"";
    }

    private void executeUpdateStatement(String sql) throws Exception {
        try {
            Method method =
                    StarRocksCatalog.class.getDeclaredMethod("executeUpdateStatement", String.class);
            method.setAccessible(true);
            method.invoke(this, sql);
        } catch (InvocationTargetException e) {
            Throwable cause = e.getCause();
            if (cause instanceof Exception) {
                throw (Exception) cause;
            }
            throw e;
        }
    }
}
