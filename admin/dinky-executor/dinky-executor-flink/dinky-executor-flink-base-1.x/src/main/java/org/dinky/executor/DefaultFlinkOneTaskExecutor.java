package org.dinky.executor;

import com.alibaba.fastjson2.JSONObject;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.table.api.TableEnvironment;
import org.apache.flink.table.api.TableResult;
import org.apache.flink.table.api.bridge.java.StreamTableEnvironment;
import org.dinky.common.remote.RmiContext;
import org.dinky.common.remote.api.TaskRemoteService;
import org.dinky.executor.data.FlinkTaskExecutorParam;
import org.dinky.executor.task.BaseFlinkTaskExecutor;
import org.dinky.executor.task.TaskExecutor;

import java.rmi.RemoteException;

public abstract class DefaultFlinkOneTaskExecutor extends BaseFlinkTaskExecutor implements TaskExecutor {
    @Override
    public void submit(JSONObject taskConfig,JSONObject taskParams) {
        FlinkTaskExecutorParam flinkTaskExecutorParam = taskParams.to(FlinkTaskExecutorParam.class);
        Configuration flinkConfiguration = Configuration.fromMap(flinkTaskExecutorParam.getFlinkConfiguration());
        String host = taskConfig.getString("host");
        Integer port = taskConfig.getInteger("port");
        StreamExecutionEnvironment env = StreamExecutionEnvironment.createRemoteEnvironment(host, port, flinkConfiguration);
        TableEnvironment tEnv = StreamTableEnvironment.create(env);
        String sql = taskConfig.getString("sql");
        TableResult result = tEnv.executeSql(sql);
        String jobId = result.getJobClient().get().getJobID().toHexString();

        TaskRemoteService task = RmiContext.getService("task");
        try {
            task.taskStatusCallback(jobId);
        } catch (RemoteException e) {
            throw new RuntimeException(e);
        }
    }

    public abstract String version();
}
