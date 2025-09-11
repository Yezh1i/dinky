package org.dinky.common.data.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Task {
    private Long id;
    private String name;
    private String type;
    private String subType;
}
