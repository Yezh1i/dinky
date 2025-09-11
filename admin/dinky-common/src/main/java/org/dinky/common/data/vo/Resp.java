package org.dinky.common.data.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Resp<T> {
    private Integer code;
    private String msg;
    private T data;

    public static <T> Resp<T> ok(T data) {
        Resp<T> resp = new Resp<>();
        resp.setCode(200);
        resp.setData(data);
        return resp;
    }
    public static <T> Resp<T> ok() {
        Resp<T> resp = new Resp<>();
        resp.setCode(200);
        return resp;
    }

    public static <T> Resp<T> error(Integer code, String msg) {
        Resp<T> resp = new Resp<>();
        resp.setCode(code);
        resp.setMsg(msg);
        return resp;
    }

    public static <T> Resp<T> error(String msg) {
        Resp<T> resp = new Resp<>();
        resp.setCode(500);
        resp.setMsg(msg);
        return resp;
    }
}
