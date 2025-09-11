import {createContext, useContext, useEffect} from 'react';
import useNotification from "antd/es/notification/useNotification";
import {setToastApi} from "./ToastUtils.ts";

const NotificationContext = createContext({} as ReturnType<typeof useNotification>[0]);

const useGlobalToast = () => useContext(NotificationContext);

export default function GlobalToast({children}: { children: React.ReactNode }) {
    const [api, contextHolder] = useNotification();

    return (
        <NotificationContext.Provider value={api}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

export const ToastInit = () => {
    const api = useGlobalToast();
    useEffect(() => {
        setToastApi(api);
    }, [api]);
    return null;
}
