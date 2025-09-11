package org.dinky.api.controller;

import lombok.AllArgsConstructor;
import org.dinky.api.service.task.FlinkService;
import org.dinky.common.data.vo.FlinkEnvironmentInfo;
import org.dinky.common.data.vo.Resp;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task/flink")
@AllArgsConstructor
public class FlinkController {
    private final FlinkService flinkService;
    @GetMapping("getFlinkEnvironmentInfo")
    public Resp<FlinkEnvironmentInfo> getFlinkEnvironmentInfo(@RequestParam("flinkLibPath") String flinkLibPath) {
        return Resp.ok(flinkService.getFlinkEnvironmentInfo(flinkLibPath));
    }
}
