package org.dinky.common.remote;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class RemoteObject{
    private String type;

    public RemoteObject(String type) {
        this.type = type;
    }
}
