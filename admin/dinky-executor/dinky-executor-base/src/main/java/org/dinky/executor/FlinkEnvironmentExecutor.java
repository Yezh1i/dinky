package org.dinky.executor;

import cn.hutool.core.exceptions.ExceptionUtil;
import cn.hutool.core.util.ReflectUtil;
import org.dinky.common.data.vo.FlinkEnvironmentInfo;

import java.lang.reflect.Method;

public class FlinkEnvironmentExecutor {
    public static void main(String[] args) {
        try {
            Method current = ReflectUtil.getPublicMethod(Class.forName("org.apache.flink.FlinkVersion"), "current");
            Object version = ReflectUtil.invokeStatic(current);

            Method getVersion = ReflectUtil.getPublicMethod(Class.forName("org.apache.flink.runtime.util.EnvironmentInformation"), "getVersion");
            Object fullVersion = ReflectUtil.invokeStatic(getVersion);

            Method getScalaVersion = ReflectUtil.getPublicMethod(Class.forName("org.apache.flink.runtime.util.EnvironmentInformation"), "getScalaVersion");
            Object scalaVersion = ReflectUtil.invokeStatic(getScalaVersion);

            FlinkEnvironmentInfo flinkEnvironmentInfo = new FlinkEnvironmentInfo();
            flinkEnvironmentInfo.setVersion(version.toString());
            flinkEnvironmentInfo.setFullVersion(fullVersion.toString());
            flinkEnvironmentInfo.setScalaVersion(scalaVersion.toString());

            System.out.print(flinkEnvironmentInfo);
        } catch (Exception e) {
            System.err.print(ExceptionUtil.stacktraceToString(e));
        }

    }
}
