/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.flink.cdc.connectors.starrocks.sink;

import org.apache.flink.cdc.common.types.BigIntType;
import org.apache.flink.cdc.common.types.BinaryType;
import org.apache.flink.cdc.common.types.BooleanType;
import org.apache.flink.cdc.common.types.CharType;
import org.apache.flink.cdc.common.types.DataType;
import org.apache.flink.cdc.common.types.DataTypeDefaultVisitor;
import org.apache.flink.cdc.common.types.DateType;
import org.apache.flink.cdc.common.types.DecimalType;
import org.apache.flink.cdc.common.types.DoubleType;
import org.apache.flink.cdc.common.types.FloatType;
import org.apache.flink.cdc.common.types.IntType;
import org.apache.flink.cdc.common.types.LocalZonedTimestampType;
import org.apache.flink.cdc.common.types.SmallIntType;
import org.apache.flink.cdc.common.types.TimeType;
import org.apache.flink.cdc.common.types.TimestampType;
import org.apache.flink.cdc.common.types.TinyIntType;
import org.apache.flink.cdc.common.types.VarBinaryType;
import org.apache.flink.cdc.common.types.VarCharType;

import com.starrocks.connector.flink.catalog.StarRocksColumn;

/**
 * Runtime patch for FLINK-CDC 3.6 StarRocks type conversion.
 *
 * <p>MySQL {@code BIGINT UNSIGNED} is represented by the pipeline as {@code DECIMAL(20, 0)}.
 * StarRocks supports that complete integer range with {@code LARGEINT}, including as a primary
 * key. The upstream connector otherwise converts every decimal primary key to VARCHAR, which
 * breaks numeric ordering and range predicates.
 */
public class StarRocksUtils$CdcDataTypeTransformer
        extends DataTypeDefaultVisitor<StarRocksColumn.Builder> {

    private static final int MAX_CHAR_SIZE = 255;
    private static final int MAX_VARCHAR_SIZE = 1048576;
    private static final int MAX_VARBINARY_SIZE = 1048576;

    private final StarRocksColumn.Builder builder;
    private final boolean isPrimaryKeys;

    public StarRocksUtils$CdcDataTypeTransformer(
            boolean isPrimaryKeys, StarRocksColumn.Builder builder) {
        this.isPrimaryKeys = isPrimaryKeys;
        this.builder = builder;
    }

    @Override
    public StarRocksColumn.Builder visit(BooleanType type) {
        return type("BOOLEAN", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(TinyIntType type) {
        // Keep the full MySQL TINYINT range, including unsigned values after source widening.
        return type("SMALLINT", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(SmallIntType type) {
        return type("SMALLINT", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(IntType type) {
        return type("INT", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(BigIntType type) {
        return type("BIGINT", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(FloatType type) {
        return type("FLOAT", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(DoubleType type) {
        return type("DOUBLE", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(DecimalType type) {
        if (isPrimaryKeys && type.getPrecision() == 20 && type.getScale() == 0) {
            return type("LARGEINT", type.isNullable());
        }
        if (!isPrimaryKeys) {
            builder.setDataType("DECIMAL");
            builder.setColumnSize(type.getPrecision());
            builder.setDecimalDigits(type.getScale());
        } else {
            builder.setDataType("VARCHAR");
            builder.setColumnSize(
                    Math.min(
                            type.getScale() == 0
                                    ? type.getPrecision() + 1
                                    : type.getPrecision() + 2,
                            MAX_VARCHAR_SIZE));
        }
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(CharType type) {
        long length = type.getLength() * 3L;
        if (length <= MAX_CHAR_SIZE && !isPrimaryKeys) {
            builder.setDataType("CHAR");
            builder.setColumnSize((int) length);
        } else {
            builder.setDataType("VARCHAR");
            builder.setColumnSize((int) Math.min(length, MAX_VARCHAR_SIZE));
        }
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(VarCharType type) {
        builder.setDataType("VARCHAR");
        builder.setColumnSize((int) Math.min(type.getLength() * 3L, MAX_VARCHAR_SIZE));
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(BinaryType type) {
        builder.setDataType("VARBINARY");
        builder.setColumnSize(Math.min(type.getLength(), MAX_VARBINARY_SIZE));
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(VarBinaryType type) {
        builder.setDataType("VARBINARY");
        builder.setColumnSize(Math.min(type.getLength(), MAX_VARBINARY_SIZE));
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(DateType type) {
        return type("DATE", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(TimeType type) {
        builder.setDataType("VARCHAR");
        builder.setColumnSize(type.getPrecision() > 0 ? 9 + type.getPrecision() : 8);
        builder.setNullable(type.isNullable());
        return builder;
    }

    @Override
    public StarRocksColumn.Builder visit(TimestampType type) {
        return type("DATETIME", type.isNullable());
    }

    @Override
    public StarRocksColumn.Builder visit(LocalZonedTimestampType type) {
        return type("DATETIME", type.isNullable());
    }

    @Override
    protected StarRocksColumn.Builder defaultMethod(DataType dataType) {
        throw new UnsupportedOperationException("Unsupported CDC data type " + dataType);
    }

    private StarRocksColumn.Builder type(String dataType, boolean nullable) {
        builder.setDataType(dataType);
        builder.setNullable(nullable);
        return builder;
    }
}
