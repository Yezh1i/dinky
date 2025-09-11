package org.dinky.common.data.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BizException extends RuntimeException{
    public BizException(Throwable cause) {
        super(cause);
    }
    public BizException(String message) {
        super(message);
    }
    public BizException(String message, Throwable cause) {
        super(message, cause);
    }
}
