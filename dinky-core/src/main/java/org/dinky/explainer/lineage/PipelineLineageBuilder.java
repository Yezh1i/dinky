/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package org.dinky.explainer.lineage;

import org.dinky.data.exception.DinkyException;
import org.dinky.trans.pipeline.FlinkCDCPipelineOperation;

import org.apache.flink.cdc.cli.parser.YamlPipelineDefinitionParser;
import org.apache.flink.cdc.common.configuration.Configuration;
import org.apache.flink.cdc.composer.definition.PipelineDef;
import org.apache.flink.cdc.composer.definition.RouteDef;

import java.util.ArrayList;
import java.util.List;

/** Builds the table-pattern lineage that can be derived from a Flink CDC pipeline route. */
public final class PipelineLineageBuilder {

    private static final String ROUTED_COLUMNS = "*";

    private PipelineLineageBuilder() {}

    public static LineageResult build(String statement) {
        try {
            String yaml = new FlinkCDCPipelineOperation().getPipelineConfigure(statement);
            PipelineDef pipeline = new YamlPipelineDefinitionParser().parse(yaml, new Configuration());
            List<LineageTable> tables = new ArrayList<>();
            List<LineageRelation> relations = new ArrayList<>();

            int routeIndex = 0;
            for (RouteDef route : pipeline.getRoute()) {
                String sourceId = "pipeline-source-" + routeIndex;
                String sinkId = "pipeline-sink-" + routeIndex;
                LineageTable source = LineageTable.build(sourceId, route.getSourceTable());
                LineageTable sink = LineageTable.build(sinkId, route.getSinkTable());
                source.getColumns().add(LineageColumn.build(ROUTED_COLUMNS, ROUTED_COLUMNS));
                sink.getColumns().add(LineageColumn.build(ROUTED_COLUMNS, ROUTED_COLUMNS));
                tables.add(source);
                tables.add(sink);
                relations.add(LineageRelation.build(
                        "pipeline-route-" + routeIndex, sourceId, sinkId, ROUTED_COLUMNS, ROUTED_COLUMNS));
                routeIndex++;
            }
            return LineageResult.build(tables, relations);
        } catch (Exception e) {
            throw new DinkyException("Failed to parse Flink CDC pipeline lineage", e);
        }
    }
}
