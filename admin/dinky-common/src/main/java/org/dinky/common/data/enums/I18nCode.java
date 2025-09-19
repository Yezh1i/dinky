package org.dinky.common.data.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.dinky.common.util.I18n;

import java.util.Objects;

@AllArgsConstructor
@Getter
public enum I18nCode {
    USER_NOT_EXIST,
    USER_PASS_ERROR,
    ;

    public String getMessage() {
        return I18n.getMessage(this.name());
    }

    public static String findMessageByKey(String key) {
        for (I18nCode i18nCode : I18nCode.values()) {
            if (Objects.equals(key, i18nCode.name())) {
                return i18nCode.getMessage();
            }
        }
        return key;
    }
}
