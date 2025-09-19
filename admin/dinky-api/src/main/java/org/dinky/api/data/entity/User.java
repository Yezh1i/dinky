package org.dinky.api.data.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("dinky_user")
public class User {
    @TableId
    private String username;
    private String password;
    private String email;
    private String phone;

}
