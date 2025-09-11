package org.dinky.executor.flink_2_0;

import com.google.auto.service.AutoService;
import org.dinky.executor.DefaultFlinkTwoTaskExecutor;
import org.dinky.executor.task.TaskExecutor;

@AutoService(TaskExecutor.class)
public class FlinkTaskExecutor extends DefaultFlinkTwoTaskExecutor {
    @Override
    public String version() {
        return "2.0";
    }
}
