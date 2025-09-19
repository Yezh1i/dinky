package org.dinky.common.data.exception;


import cn.hutool.core.util.StrUtil;
import org.dinky.common.data.enums.I18nCode;

public class BizException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * Exception status code
     */
    private I18nCode code;

    /**
     * Exception parameters
     */
    private Object[] errorArgs;

    /**
     * Constructs a BusException with the specified message.
     *
     * @param message the detail message
     */
    public BizException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a BusException with the specified message.
     *
     * @param message the detail message
     */
    public BizException(String message) {
        super(message);
    }

    /**
     * Constructs a BusException with the specified status and error arguments.
     *
     * @param status    the status code representing the exception
     * @param errorArgs the arguments used for error message formatting
     */
    public BizException(I18nCode status, Object... errorArgs) {
        super(formatMessage(null, status, errorArgs));
        this.code = status;
        this.errorArgs = errorArgs;
    }

    /**
     * Constructs a BusException with the specified cause, status, and error arguments.
     *
     * @param cause     the cause of the exception
     * @param status    the status code representing the exception
     * @param errorArgs the arguments used for error message formatting
     */
    public BizException(Throwable cause, I18nCode status, Object... errorArgs) {
        super(formatMessage(cause.getMessage(), status, errorArgs), cause);
        this.code = status;
        this.errorArgs = errorArgs;
    }

    /**
     * Creates a BusException instance with the specified message.
     *
     * @param message the detail message
     * @return a new BusException instance
     */
    public static BizException of(String message) {
        return new BizException(message);
    }

    /**
     * Creates a BusException instance with the specified status, and error arguments.
     *
     * @param status    the status code representing the exception
     * @param errorArgs the arguments used for error message formatting
     * @return a new BusException instance
     */
    public static BizException of(I18nCode status, Object... errorArgs) {
        return new BizException(status, errorArgs);
    }

    /**
     * Creates a BusException instance with the specified cause, status, and error arguments.
     *
     * @param cause     the cause of the exception
     * @param status    the status code representing the exception
     * @param errorArgs the arguments used for error message formatting
     * @return a new BusException instance
     */
    public static BizException of(Throwable cause, I18nCode status, Object... errorArgs) {
        return new BizException(cause, status, errorArgs);
    }

    /**
     * Formats the exception message with optional cause message and error arguments.
     */
    private static String formatMessage(String causeMessage, I18nCode status, Object... errorArgs) {
        Object[] args = errorArgs == null ? new Object[0] : errorArgs;

        if (causeMessage != null) {
            Object[] extendedArgs = new Object[args.length + 1];
            System.arraycopy(args, 0, extendedArgs, 0, args.length);
            extendedArgs[args.length] = causeMessage;
            args = extendedArgs;
        }

        return StrUtil.format(status.getMessage(), args);
    }
}
