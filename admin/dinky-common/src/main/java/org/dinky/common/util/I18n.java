/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package org.dinky.common.util;


import org.dinky.common.context.i18n.LocaleContextHolder;

import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Locale;
import java.util.ResourceBundle;

public final class I18n {

    private static final String MESSAGES_BASE = "i18n.messages";
    public static final String JDK_VERSION = System.getProperty("java.specification.version");
    public static final boolean JDK_ABOVE_1_8 = JDK_VERSION.compareTo("1.8") > 0;

    static {
        Locale.setDefault(Locale.US);
    }

    private I18n() {}

    private static Locale getLocale() {
        return LocaleContextHolder.getLocale();
    }

    public static boolean isSupported(Locale l) {
        Locale[] availableLocales = Locale.getAvailableLocales();
        return Arrays.asList(availableLocales).contains(l);
    }

    public static String getMessage(String key) {
        ResourceBundle bundle = ResourceBundle.getBundle(MESSAGES_BASE,getLocale());
        if (!bundle.containsKey(key)) {
            return key;
        }
        String message = bundle.getString(key);
        if (!JDK_ABOVE_1_8) {
            message = new String(message.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
        }
        return message;
    }

    public static String getMessage(String key, Object... arguments) {
        return MessageFormat.format(getMessage(key), arguments);
    }
}
