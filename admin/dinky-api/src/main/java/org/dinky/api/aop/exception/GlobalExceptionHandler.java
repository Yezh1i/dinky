package org.dinky.api.aop.exception;


import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import cn.hutool.core.exceptions.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.dinky.common.data.exception.BizException;
import org.dinky.common.data.vo.Resp;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final List<Class<? extends Throwable>> PRINT_MSG_EXCEPTION_LIST = Arrays.asList(
            BizException.class,
            MissingServletRequestParameterException.class,
            NotPermissionException.class,
            NotLoginException.class);

    // 全局异常拦截
    @ExceptionHandler
    public Resp<Void> handlerException(Exception e) {
        if (e instanceof NotLoginException || ExceptionUtil.getRootCause(e) instanceof NotLoginException) {
            String errorMsg = ExceptionUtil.getSimpleMessage(ExceptionUtil.getRootCause(e));
            return Resp.error(401, errorMsg);
        }

        if (PRINT_MSG_EXCEPTION_LIST.contains(e.getClass())) {
            log.error(e.getMessage());
            return Resp.error(e.getMessage());
        } else {
            log.error("", e);
        }
        return Resp.error(ExceptionUtil.getRootCauseMessage(e));
    }

    //    @ResponseStatus(HttpStatus.BAD_REQUEST) //设置状态码为 400
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public Resp<Void> paramExceptionHandler(MethodArgumentNotValidException e) {
        BindingResult exceptions = e.getBindingResult();
        // 判断异常中是否有错误信息，如果存在就使用异常中的消息，否则使用默认消息
        if (exceptions.hasErrors()) {
            List<ObjectError> errors = exceptions.getAllErrors();
            if (!errors.isEmpty()) {
                // 这里列出了全部错误参数
                String errorMsg = errors.stream()
                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                        .collect(Collectors.joining("\n"));
                return Resp.error(errorMsg);
            }
        }
        return Resp.error("请求参数错误");
    }
}

