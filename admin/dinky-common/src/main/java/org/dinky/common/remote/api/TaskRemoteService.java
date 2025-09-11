package org.dinky.common.remote.api;



import com.dtflys.forest.annotation.Address;
import com.dtflys.forest.annotation.Post;
import org.dinky.common.remote.DinkyAddressSource;

@Address(source = DinkyAddressSource.class)
public interface TaskRemoteService  {
    /**
     * 任务状态回调：当任务成功或失败的时候，需要发送的回调
     * <br />
     * example: <code>Flink</code> 提交成功后 ，会保存 jobId
     */
    @Post("/test/taskStatusCallback")
    void taskStatusCallback(String ddd) ;
}
