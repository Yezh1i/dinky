// ToastUtils.ts
import type { NotificationInstance } from 'antd/es/notification/interface';

let ToastApi: NotificationInstance | null = null;

export const setToastApi = (api: NotificationInstance) => {
    ToastApi = api;
};

export const getToastApi = () => {
    if (!ToastApi) {
        console.warn('Toast API未初始化');
        return null;
    }
    return ToastApi;
};
