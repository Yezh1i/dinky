package org.dinky.api.service.user.impl;

import lombok.AllArgsConstructor;
import org.dinky.api.data.dto.user.UserLoginDTO;
import org.dinky.api.data.vo.user.UserVO;
import org.dinky.api.mapper.UserMapper;
import org.dinky.api.service.user.UserService;
import org.dinky.common.data.enums.I18nCode;
import org.dinky.common.data.exception.BizException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    @Override
    public UserVO login(UserLoginDTO userLoginDTO) {
//        User user = userMapper.selectById(userLoginDTO.username());
        String username = userLoginDTO.username();
        String password = userLoginDTO.password();
        if (!"admin".equals( username)){
            throw BizException.of(I18nCode.USER_NOT_EXIST);
        }
        if (!"admin".equals(password)){
            throw BizException.of(I18nCode.USER_PASS_ERROR);
        }
        UserVO userVO = new UserVO();
        userVO.setUsername(username);
        return userVO;
    }
}
