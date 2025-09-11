package org.dinky.executor.task;

public abstract class BaseFlinkTaskExecutor implements TaskExecutor {
    @Override
    public String taskType() {
        return "flink";
    }
//    EnvironmentInformation.getVersion()
}
