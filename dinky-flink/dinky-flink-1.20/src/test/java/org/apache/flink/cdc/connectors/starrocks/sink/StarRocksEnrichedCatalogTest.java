/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0.
 */
package org.apache.flink.cdc.connectors.starrocks.sink;

import com.starrocks.connector.flink.catalog.StarRocksColumn;
import com.starrocks.connector.flink.catalog.StarRocksTable;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

class StarRocksEnrichedCatalogTest {

    @Test
    void escapesCommentsAndSupportsChineseIdentifiers() {
        StarRocksColumn id =
                new StarRocksColumn.Builder()
                        .setColumnName("中文字段")
                        .setOrdinalPosition(0)
                        .setDataType("BIGINT")
                        .setNullable(false)
                        .setColumnComment("当值为\"audited\"时，路径C:\\tmp\n下一行")
                        .build();
        StarRocksTable table =
                new StarRocksTable.Builder()
                        .setDatabaseName("目标库")
                        .setTableName("中文表")
                        .setTableType(StarRocksTable.TableType.PRIMARY_KEY)
                        .setColumns(Collections.singletonList(id))
                        .setTableKeys(Collections.singletonList("中文字段"))
                        .setDistributionKeys(Collections.singletonList("中文字段"))
                        .setNumBuckets(1)
                        .setComment("表注释\"安全\"")
                        .setTableProperties(Collections.singletonMap("replication_num", "1"))
                        .build();

        String sql = StarRocksEnrichedCatalog.buildCreateTableSql(table, true);

        assertThat(sql)
                .contains("`目标库`.`中文表`")
                .contains("`中文字段` BIGINT NOT NULL")
                .contains("COMMENT \"当值为\\\"audited\\\"时，路径C:\\\\tmp\\n下一行\"")
                .contains("COMMENT \"表注释\\\"安全\\\"\"")
                .contains("PRIMARY KEY (`中文字段`)")
                .contains("DISTRIBUTED BY HASH (`中文字段`) BUCKETS 1");
    }

    @Test
    void escapesBackticksInIdentifiers() {
        assertThat(StarRocksEnrichedCatalog.identifier("a`b")).isEqualTo("`a``b`");
    }
}
