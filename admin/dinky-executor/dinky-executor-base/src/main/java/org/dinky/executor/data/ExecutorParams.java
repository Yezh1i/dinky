package org.dinky.executor.data;

import com.alibaba.fastjson2.JSONObject;
import org.dinky.common.data.entity.Task;

import java.util.Properties;

public class ExecutorParams {
    private Task task;
    private Properties properties;
    private JSONObject taskConfig;
    private JSONObject taskParams;

    @Override
    public String toString() {
        return JSONObject.toJSONString( this);
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public JSONObject getTaskParams() {
        if (taskParams == null){
            taskParams = new JSONObject();
        }
        return taskParams;
    }

    public void setTaskParams(JSONObject taskParams) {
        this.taskParams = taskParams;
    }

    public JSONObject getTaskConfig() {
        return taskConfig;
    }

    public void setTaskConfig(JSONObject taskConfig) {
        this.taskConfig = taskConfig;
    }
}
