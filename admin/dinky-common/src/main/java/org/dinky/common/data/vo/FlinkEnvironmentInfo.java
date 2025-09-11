package org.dinky.common.data.vo;

import com.alibaba.fastjson2.JSON;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlinkEnvironmentInfo {
    /**
     * Flink 版本信息
     * eg: 1.18
     */
    private String version;

    /**
     * Flink 全版本信息
     * eg: 1.18.1
     */
    private String fullVersion;
    /**
     * Scala 版本信息
     * eg: 2.12
     */
    private String scalaVersion;

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }
}
