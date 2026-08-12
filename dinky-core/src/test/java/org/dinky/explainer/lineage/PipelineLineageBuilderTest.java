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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.dinky.job.JobConfig;
import org.dinky.trans.pipeline.FlinkCDCPipelineOperation;

import org.junit.jupiter.api.Test;

class PipelineLineageBuilderTest {

    private static final String STATEMENT = "EXECUTE PIPELINE WITHYAML (\n"
            + "source:\n  type: mysql\n  hostname: localhost\n  username: root\n  password: pwd\n"
            + "  tables: app_db.\\.*\n"
            + "sink:\n  type: values\n"
            + "route:\n  - source-table: app_db.\\.*\n    sink-table: ods.<>\n    replace-symbol: <>\n"
            + "pipeline:\n  name: test\n)";

    @Test
    void buildsTablePatternLineageWithoutFlinkPlanner() {
        LineageResult result = LineageBuilder.getColumnLineageByLogicalPlan(STATEMENT, (JobConfig) null);

        assertEquals(2, result.getTables().size());
        assertEquals("app_db.\\.*", result.getTables().get(0).getName());
        assertEquals("ods.<>", result.getTables().get(1).getName());
        assertEquals(1, result.getRelations().size());
        assertEquals("*", result.getRelations().get(0).getSrcTableColName());
    }

    @Test
    void recognizesPipelineStatementWithWhitespaceAndSemicolon() {
        assertTrue(FlinkCDCPipelineOperation.isPipelineStatement("  " + STATEMENT + ";  "));
    }
}
