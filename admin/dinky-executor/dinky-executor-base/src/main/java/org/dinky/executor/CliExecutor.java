package org.dinky.executor;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ServiceLoaderUtil;
import com.alibaba.fastjson2.JSON;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.dinky.common.data.entity.Task;
import org.dinky.common.remote.RmiContext;
import org.dinky.executor.data.ExecutorParams;
import org.dinky.executor.task.TaskExecutor;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CliExecutor {
    public static void main(String[] args) {
        // 1. 创建选项定义
        Options options = new Options();
        options.addOption("c", "config", true, "指定配置文件");

        // 2. 创建解析器
        CommandLineParser parser = new DefaultParser();
        HelpFormatter formatter = new HelpFormatter();

        try {
            // 3. 解析参数
            CommandLine cmd = parser.parse(options, args);
            String configPath = cmd.getOptionValue("c");
            String config = FileUtil.readUtf8String(configPath);
            ExecutorParams executorParams = JSON.to(ExecutorParams.class, config);


            List<TaskExecutor> taskExecutors = ServiceLoaderUtil.loadList(TaskExecutor.class);
            Map<String, TaskExecutor> taskExecutorPool = CollUtil.toMap(taskExecutors, new HashMap<>(), TaskExecutor::taskType);
            Task task = executorParams.getTask();
            if (!taskExecutorPool.containsKey(task.getType())) {
                System.err.println("不支持的任务类型: " + task.getType());
                System.exit(1);
            }
            String rmiPort = executorParams.getProperties().getProperty("rmi.port");
            Registry registry = LocateRegistry.getRegistry("localhost", Convert.toInt(rmiPort));
            RmiContext.setRegistry(registry);
            RmiContext.setAddress("rmi://localhost:" + rmiPort);

            taskExecutorPool.get(task.getType()).submit(executorParams.getTaskConfig(), executorParams.getTaskParams());

        } catch (ParseException | RemoteException e) {
            System.err.println("参数错误: " + e.getMessage());
            formatter.printHelp("greet", options);
            System.exit(1);
        }
    }
}
