package org.dinky.executor.data;

import com.alibaba.fastjson2.JSONObject;
import org.dinky.common.data.entity.Task;

import java.util.HashMap;
import java.util.Map;

public class FlinkTaskExecutorParam {
    private Task task;
    private String sql;
    private JSONObject config;
    private Map<String, String> flinkConfiguration=new HashMap<>();

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public JSONObject getConfig() {
        return config;
    }

    public void setConfig(JSONObject config) {
        this.config = config;
    }

    public Map<String, String> getFlinkConfiguration() {
        return flinkConfiguration;
    }

    public void setFlinkConfiguration(Map<String, String> flinkConfiguration) {
        this.flinkConfiguration = flinkConfiguration;
    }
}
