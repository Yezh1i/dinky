

// import { message } from 'antd';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type {Resp} from "@/api/resp.ts";
import {TOKEN_KEY} from "@/constants/user.ts";

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

// const project = JSON.parse(localStorage.getItem('project') || '{}');

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(TOKEN_KEY);
        // const project = useSystemStore.getState().project;
        if (token && config.headers) {
            config.headers['token'] = `${token}`;
        }
        // if (project) {
        //     config.headers['projectId'] = `${project.project_id}`;
        //     config.headers['env'] = `${project.env}`;
        // }
        return config;
    },
    (error) => {
        console.error('请求拦截出错:', error);
        return Promise.reject(error);
    }
);

const responseHandler = (code: number, msg: string) => {
    switch (code) {
        case 401:
            // message.warning('未授权，请重新登录');
            window.location.href = '/login';
            localStorage.removeItem(TOKEN_KEY)
            break;
        case 404:
            // message.error('请求地址不存在');
            break;
        default:
            // message.error("系统拦截异常："+msg || '系统异常');
            break;
    }
}

// 响应拦截器
service.interceptors.response.use(
    <T>(response: AxiosResponse<Resp<T>>) => {
        const res = response.data;
        if (res.code !== 200) {
            responseHandler(res.code, res.msg);
            // 可以抛出自定义错误，便于 catch 处理
            return Promise.reject(new Error(res.msg));
        }
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token){
            const loginToken = response.headers[TOKEN_KEY];
            if (loginToken){
                console.log(loginToken)
                localStorage.setItem(TOKEN_KEY, loginToken)
            }
        }
        return res.data; // 返回 data 部分
    },
    (error) => {
        console.error('响应异常:', error);
        if (error.message.includes('timeout')) {
            // message.error('请求超时，请检查网络');
        } else if (error.response) {
            const status = error.response.status;
            responseHandler(status, error.response.data.message);
        } else {
            // message.error('网络异常，请重试');
        }
        return Promise.reject(error);
    }
);

// 定义请求方法的类型
interface RequestMethods {
    get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
    put<T = unknown>(url: string, data?: Record<string, unknown>): Promise<T>;
    delete<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
}

// 封装 GET/POST/PUT/DELETE
const request: RequestMethods = {
    get(url, params) {
        return service.get(url, { params });
    },
    post(url, data) {
        return service.post(url, data);
    },
    put(url, data) {
        return service.put(url, data);
    },
    delete(url, params) {
        return service.delete(url, { params });
    }
};

export default request;
