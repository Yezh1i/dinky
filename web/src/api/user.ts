import request from "@/api/request.ts";
import type {Resp} from "@/api/resp.ts";
import type {User} from "@/api/type/user.ts";

export const login = (username: string, password: string) => {
    return request.post<Resp<User>>('/api/user/login', {username, password})
}
