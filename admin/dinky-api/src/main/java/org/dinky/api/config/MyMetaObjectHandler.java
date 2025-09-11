package org.dinky.api.config;


import cn.dev33.satoken.spring.SpringMVCUtil;
import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class MyMetaObjectHandler implements MetaObjectHandler {

    private static final String CREATE_TIME = "createTime";
    private static final String UPDATE_TIME = "updateTime";
    private static final String CREATOR = "creator";
    private static final String UPDATER = "updater";

    @Override
    public void insertFill(MetaObject metaObject) {
        if (metaObject.hasGetter(CREATE_TIME) && getFieldValByName(CREATE_TIME, metaObject) == null) {
            this.strictInsertFill(metaObject, CREATE_TIME, Date.class, new Date());
        }

        try {
            if (SpringMVCUtil.isWeb() && StpUtil.isLogin()) {
                if (metaObject.hasGetter(CREATOR) && getFieldValByName(CREATOR, metaObject) == null) {
                    this.strictInsertFill(metaObject, CREATOR, String.class, StpUtil.getLoginIdAsString());
                }
            }
        } catch (RuntimeException e) {
            // 如果捕获到NotLoginException，可以在这里处理
            log.error("", e);
        }

        this.updateFill(metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        if (metaObject.hasGetter(UPDATE_TIME)) {
            this.strictUpdateFill(metaObject, UPDATE_TIME, Date.class, new Date());
        }
        if (SpringMVCUtil.isWeb() && StpUtil.isLogin()) {
            if (metaObject.hasGetter(UPDATER)) {
                this.strictUpdateFill(metaObject, UPDATER, String.class, StpUtil.getLoginIdAsString());
            }
        }
    }
}
