package org.dinky.api.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.dinky.common.context.i18n.LocaleContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;

public class I18nInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        LocaleContextHolder.setLocale(request.getLocale());
        return true;
    }
}
