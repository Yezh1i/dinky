package org.dinky.api.controller;

import lombok.AllArgsConstructor;
import org.dinky.api.data.dto.user.UserLoginDTO;
import org.dinky.api.data.vo.user.UserVO;
import org.dinky.api.service.user.UserService;
import org.dinky.common.data.vo.Resp;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @RequestMapping("/login")
    public Resp<UserVO> login(@RequestBody UserLoginDTO userLoginDTO) {
        return Resp.ok(userService.login(userLoginDTO));
    }
}
