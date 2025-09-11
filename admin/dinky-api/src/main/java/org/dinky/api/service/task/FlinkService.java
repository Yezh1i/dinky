package org.dinky.api.service.task;

import org.dinky.common.data.vo.FlinkEnvironmentInfo;

public interface FlinkService {
    FlinkEnvironmentInfo getFlinkEnvironmentInfo(String flinkLibPath);

}
