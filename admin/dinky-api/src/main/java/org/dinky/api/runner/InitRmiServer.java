package org.dinky.api.runner;

import cn.hutool.core.convert.Convert;
import cn.hutool.extra.spring.SpringUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dinky.common.remote.api.TaskRemoteService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.naming.Context;
import javax.naming.InitialContext;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

@Slf4j
@Component
@AllArgsConstructor
public class InitRmiServer implements ApplicationRunner {
    private final TaskRemoteService taskRemoteService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Integer port = Convert.toInt(SpringUtil.getProperty("rmi.port"));
        log.info("============ InitRmiServer Start ============");
        Registry registry = LocateRegistry.createRegistry(port);
        registry.rebind("task", UnicastRemoteObject.exportObject(taskRemoteService,0) );
        log.info("============ InitRmiServer Success ============");

    }
}
