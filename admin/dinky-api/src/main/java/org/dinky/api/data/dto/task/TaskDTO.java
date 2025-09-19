package org.dinky.api.data.dto.task;

import com.alibaba.fastjson2.JSONObject;
import org.dinky.common.data.entity.Task;

public record TaskDTO(Task task, JSONObject taskConfig, JSONObject taskParams) {
}
