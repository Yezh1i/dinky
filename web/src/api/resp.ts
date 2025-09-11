// 添加泛型
export type Resp<T> = {
    code: number;
    msg: string;
    data: T;
};
