package org.dinky.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.dinky.api.data.dto.task.TaskDTO;
import org.dinky.api.service.task.TaskService;
import org.dinky.common.data.vo.Resp;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/task")
@AllArgsConstructor
class TaskController {
    private final TaskService taskService;

    @PostMapping("submit")
    @Operation(summary = "API_TASK_SUBMIT", description = "API_TASK_SUBMIT_DESC")
    public Resp<Void> submit(@RequestBody TaskDTO taskDTO) {
        taskService.submit(taskDTO.task(),taskDTO.taskConfig(),taskDTO.taskParams());
        return Resp.ok();
    }


}
