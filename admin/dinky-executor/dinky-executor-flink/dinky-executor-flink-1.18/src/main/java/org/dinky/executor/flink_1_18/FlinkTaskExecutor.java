package org.dinky.executor.flink_1_18;

import com.google.auto.service.AutoService;
import org.dinky.executor.DefaultFlinkOneTaskExecutor;
import org.dinky.executor.task.TaskExecutor;

@AutoService(TaskExecutor.class)
public class FlinkTaskExecutor extends DefaultFlinkOneTaskExecutor {
    @Override
    public String version() {
        return "1.18";
    }
}
