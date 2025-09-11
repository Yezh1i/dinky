package org.dinky.common.util;

import cn.hutool.core.io.FileUtil;
import cn.hutool.system.SystemUtil;
import lombok.experimental.UtilityClass;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@UtilityClass
public final class CommandUtil {

    /**
     * 将若干 File/Path/CharSequence 拼接成 classpath 字符串
     */
    public static String buildClasspath(String... elements) {
        if (elements == null || elements.length == 0) {
            return "";
        }
        return String.join(File.pathSeparator, elements);
    }

    /**
     * 开始构建命令
     */
    public static CommandBuilder newCommand() {
        return new CommandBuilder();
    }

    /**
     * 链式命令构建器
     */
    public static class CommandBuilder {
        private final List<String> command = new ArrayList<>();

        /**
         * 设置可执行文件（如 java、javac、mvn 等）
         */
        public CommandBuilder executable(String exe) {
            command.add(exe);
            return this;
        }

        /**
         * 追加 JVM 参数
         */
        public CommandBuilder jvmArgs(String... args) {
            command.add("-Dfile.encoding=utf-8");
            Collections.addAll(command, args);
            return this;
        }

        /**
         * 设置 -classpath 或 -cp
         */
        public CommandBuilder classpath(String cp) {
            command.add("-cp");
            command.add(cp);
            return this;
        }

        /**
         * 设置 -classpath 或 -cp（可接受多个元素，内部自动拼接）
         */
        public CommandBuilder classpath(String... elements) {
            return classpath(buildClasspath(elements));
        }

        /**
         * 设置主类
         */
        public CommandBuilder mainClass(String mainClass) {
            command.add(mainClass);
            return this;
        }

        /**
         * 追加程序参数
         */
        public CommandBuilder programArgs(String... args) {
            Collections.addAll(command, args);
            return this;
        }

        /**
         * 返回完整的命令列表（不可修改）
         */
        public List<String> build() {
            return Collections.unmodifiableList(command);
        }

        /**
         * 创建一个 ProcessBuilder，已正确设置命令
         */
        public ProcessBuilder toProcessBuilder() {
            ProcessBuilder pb = new ProcessBuilder(build());
            // 如需继承当前进程环境：pb.inheritIO();
            return pb;
        }

        @Override
        public String toString() {
            return String.join(" ", command);
        }
    }

    /* ============== 快捷静态方法 ============== */

    /**
     * 快速生成 java -cp ... MainClass ...
     */
    public static List<String> javaCommand(String javaExecutable, String mainClass, String classpath, String... programArgs) {
        return newCommand()
                .executable(javaExecutable)
                .jvmArgs()
                .classpath(classpath)
                .mainClass(mainClass)
                .programArgs(programArgs)
                .build();
    }

    /**
     * 查找当前 JAVA_HOME 或 PATH 中的 java 可执行文件
     */
    public static String findJavaExecutable() {
        String javaHome = System.getProperty("java.home");
        File java;
        if (FileUtil.isWindows()) {
            java = new File(javaHome, "bin/java.exe");
        } else {
            java = new File(javaHome, "bin/java");
        }
        if (java.canExecute()) {
            return java.getAbsolutePath();
        }
        // 兜底：PATH 中的 java
        return "java";
    }
}
