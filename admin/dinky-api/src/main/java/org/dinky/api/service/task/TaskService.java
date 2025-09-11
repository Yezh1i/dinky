package org.dinky.api.service.task;

import com.alibaba.fastjson2.JSONObject;
import org.dinky.common.data.entity.Task;

public interface TaskService {
    void submit(Task task, JSONObject taskConfig, JSONObject taskParams);

}
