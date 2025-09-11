package org.dinky.executor;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.io.file.Tailer;
import cn.hutool.core.lang.JarClassLoader;
import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.RuntimeUtil;
import cn.hutool.system.SystemUtil;
import com.alibaba.fastjson.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.dinky.common.data.entity.Task;
import org.dinky.common.util.CommandUtil;
import org.dinky.executor.data.ExecutorParams;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class ExecutorTests {
    @Test
    void mainTest() {
        String userDir = System.getProperty("user.dir");
        File projectDir = FileUtil.getParent(FileUtil.file(userDir), 2);
        File tempFile = FileUtil.createTempFile("", "", FileUtil.file(projectDir, "temp/executor/task"), false);

        log.info("tempFile: {}", tempFile.getAbsolutePath());

        Task task = new Task();
        task.setName("test-flink");
        task.setType("flink");
        task.setSubType("flink-sql");
        ExecutorParams executorParams = new ExecutorParams();
        executorParams.setTask(task);
        executorParams.setProperties(null);

        FileUtil.writeUtf8String(executorParams.toString(), tempFile);
        JarClassLoader jarClassLoader = JarClassLoader.loadJar(FileUtil.file("D:\\flink\\flink-1.18.1\\lib"));
        jarClassLoader.addJar(FileUtil.file(new File(userDir).getParent(),"build/plugins/executor"));

        for (String path : SystemUtil.getJavaRuntimeInfo().getClassPathArray()) {
            jarClassLoader.addJar(FileUtil.file( path));
        }
//        jarClassLoader.addURL(CliExecutor.class.getProtectionDomain().getCodeSource().getLocation());
        Thread.currentThread().setContextClassLoader(jarClassLoader);


//        Method mainMethod = ReflectUtil.getPublicMethod(CliExecutor.class, "main", String[].class);
//        ReflectUtil.invokeStatic(mainMethod, new String[]{"-c", tempFile.getAbsolutePath()},null);
//        CliExecutor.main(new String[]{"-c", tempFile.getAbsolutePath()});

        List<String> classPaths = Arrays.stream(jarClassLoader.getURLs()).map(URL::getPath).collect(Collectors.toList());
//        classPaths.add(SystemUtil.getJavaRuntimeInfo().getClassPath());
        String classpath = CommandUtil.buildClasspath(classPaths.toArray(new String[0]));
        List<String> command = CommandUtil.javaCommand(CommandUtil.findJavaExecutable(), "org.dinky.executor.CliExecutor", classpath, "-c", tempFile.getAbsolutePath());
        // 调用子进程指令，并打印输出
        ProcessBuilder processBuilder = new ProcessBuilder();
        File file = FileUtil.file("D:\\zackyoung\\project\\java\\dinky\\admin\\build\\example2.log");
        processBuilder.redirectOutput(file);
        processBuilder.command(command);
        try {
            Process start = processBuilder.start();
            new Tailer(file, System.out::println).start(true);
            int i = start.waitFor();
            // 获取当前编码

            System.err.println(IoUtil.read(start.getInputStream(), Charset.defaultCharset()));
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }

    }
}
