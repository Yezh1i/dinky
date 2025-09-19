package org.dinky.api.service.user;


import org.dinky.api.data.dto.user.UserLoginDTO;
import org.dinky.api.data.vo.user.UserVO;

public interface UserService {
    UserVO login(UserLoginDTO userLoginDTO);
}
