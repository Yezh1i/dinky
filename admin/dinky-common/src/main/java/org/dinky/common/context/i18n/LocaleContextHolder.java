package org.dinky.common.context.i18n;

import java.util.Locale;

public class LocaleContextHolder {
    private static final ThreadLocal<Locale> locale = new InheritableThreadLocal<>();
    public static void setLocale(Locale l) {
        locale.set(l);
    }
    public static Locale getLocale() {
        return locale.get();
    }
}
