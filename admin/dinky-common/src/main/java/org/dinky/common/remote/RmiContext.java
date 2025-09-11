package org.dinky.common.remote;

import lombok.experimental.UtilityClass;

import javax.naming.NamingException;
import java.rmi.AccessException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.Registry;
import java.util.concurrent.atomic.AtomicReference;

@UtilityClass
public class RmiContext {
    private static final AtomicReference<String> address = new AtomicReference<>();
    private static final AtomicReference<Registry> registry = new AtomicReference<>();

    public static String getAddress() {
        return address.get();
    }

    public static void setAddress(String address) {
        RmiContext.address.set(address);
    }

    public static Registry getRegistry() {
        return registry.get();
    }

    public static void setRegistry(Registry registry) {
        RmiContext.registry.set(registry);
    }

    public static <T> T getService(String path) {
        try {
            return (T) registry.get().lookup(path);
        } catch (NotBoundException | RemoteException e) {
            throw new RuntimeException(e);
        }
    }


}
