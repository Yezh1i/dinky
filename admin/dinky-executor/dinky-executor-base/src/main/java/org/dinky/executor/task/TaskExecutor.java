package org.dinky.executor.task;

import com.alibaba.fastjson2.JSONObject;

public interface TaskExecutor {
    void submit(JSONObject taskConfig, JSONObject taskParams);
//    void execute(JSONObject taskConfig, JSONObject taskParams);

    String taskType();
}
