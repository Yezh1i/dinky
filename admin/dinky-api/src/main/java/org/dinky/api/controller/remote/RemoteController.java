package org.dinky.api.controller.remote;

import com.dtflys.forest.http.Res;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/remote")
public class RemoteController {
    @RequestMapping("/test")
    public Res<Boolean> test() {

    }
}
