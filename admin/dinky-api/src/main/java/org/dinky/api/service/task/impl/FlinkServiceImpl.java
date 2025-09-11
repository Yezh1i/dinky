package org.dinky.api.service.task.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.lang.JarClassLoader;
import cn.hutool.core.util.StrUtil;
import cn.hutool.system.SystemUtil;
import com.alibaba.fastjson2.JSON;
import org.dinky.api.service.task.FlinkService;
import org.dinky.common.data.vo.FlinkEnvironmentInfo;
import org.dinky.common.util.CommandUtil;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FlinkServiceImpl implements FlinkService {
    @Override
    public FlinkEnvironmentInfo getFlinkEnvironmentInfo(String flinkLibPath) {
        String userDir = System.getProperty("user.dir");
        Charset charset = Charset.defaultCharset();


        JarClassLoader jarClassLoader = JarClassLoader.loadJar(FileUtil.file(flinkLibPath));
        jarClassLoader.addJar(FileUtil.file(new File(userDir), "admin/build/plugins/executor"));


        List<String> classPaths = Arrays.stream(jarClassLoader.getURLs()).map(URL::getPath).collect(Collectors.toList());
        String classpath = CommandUtil.buildClasspath(classPaths.toArray(new String[0]));
        List<String> command = CommandUtil.javaCommand(CommandUtil.findJavaExecutable(), "org.dinky.executor.FlinkEnvironmentExecutor", classpath, "getVersion");
        // 调用子进程指令，并打印输出
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(command);
        Map<String, String> environment = processBuilder.environment();

        environment.put("file.encoding",charset.toString());
        environment.put("log.level","ERROR");
        try {
            Process start = processBuilder.start();
            int i = start.waitFor();
            if (i != 0) {
                throw new RuntimeException(IoUtil.read(start.getErrorStream(), charset));
            }
            return JSON.to(FlinkEnvironmentInfo.class, IoUtil.read(start.getInputStream(), charset));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
