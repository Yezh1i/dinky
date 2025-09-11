package org.dinky.api.service.task.impl;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.io.file.Tailer;
import cn.hutool.core.lang.JarClassLoader;
import cn.hutool.extra.spring.SpringUtil;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.dinky.api.service.task.TaskService;
import org.dinky.common.data.entity.Task;
import org.dinky.common.remote.api.TaskRemoteService;
import org.dinky.common.util.CommandUtil;
import org.dinky.executor.data.ExecutorParams;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TaskServiceImpl implements TaskService, TaskRemoteService {
    @Override
    public void taskStatusCallback(String ddd) {
        log.info("任务状态回调: {}", ddd);
    }

    @Override
    public void submit(Task task, JSONObject taskConfig, JSONObject taskParams) {
        String userDir = System.getProperty("user.dir");
        File taskDir = FileUtil.file(userDir, "temp/executor/task");
        File tempFile = FileUtil.createTempFile(task.getId() + "-", ".json", taskDir, false);
        File logFile = FileUtil.file(taskDir, "logs", FileNameUtil.getPrefix(tempFile) + ".log");

        log.info("tempFile: {}", tempFile.getAbsolutePath());
        ExecutorParams executorParams = new ExecutorParams();
        executorParams.setTask(task);
        executorParams.setTaskConfig(taskConfig);
        executorParams.setTaskParams(taskParams);
        Properties properties = new Properties();
        properties.setProperty("rmi.port", SpringUtil.getProperty("rmi.port"));
        executorParams.setProperties(properties);

        FileUtil.writeUtf8String(executorParams.toString(), tempFile);

        String flinkLibPath = taskConfig.getString("flink_lib_path");
        JarClassLoader jarClassLoader = JarClassLoader.loadJar(FileUtil.file(flinkLibPath));
        jarClassLoader.addJar(FileUtil.file(userDir, "admin/build/plugins/executor"));

//        jarClassLoader.addURL(com.alibaba.fastjson2.schema.JSONSchema.class.getProtectionDomain().getCodeSource().getLocation());


        List<String> classPaths = Arrays.stream(jarClassLoader.getURLs()).map(URL::getPath).collect(Collectors.toList());
        String classpath = CommandUtil.buildClasspath(classPaths.toArray(new String[0]));
        List<String> command = CommandUtil.javaCommand(CommandUtil.findJavaExecutable(), "org.dinky.executor.CliExecutor", classpath, "-c", tempFile.getAbsolutePath());
        // 调用子进程指令，并打印输出
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.redirectOutput(logFile);
        processBuilder.command(command);

        Charset charset = Charset.defaultCharset();
        Map<String, String> environment = processBuilder.environment();

        environment.put("file.encoding",charset.toString());
        try {
            Process start = processBuilder.start();
            new Tailer(logFile, System.out::println).start(true);
            int i = start.waitFor();
            if (i != 0) {
                throw new RuntimeException("任务执行失败:"+IoUtil.read(start.getErrorStream(), charset));
            }

            System.err.println(IoUtil.read(start.getInputStream(), charset));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
