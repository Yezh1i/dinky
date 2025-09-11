import {BrowserRouter as Router, Routes, Route} from 'react-router';
import {type JSX, useEffect, useMemo} from 'react';
import React from 'react';
import {useMainPageStore} from '../store/MainPageStore';
import MainLayout from './MainLayout';
import {TOKEN_KEY} from "@/constants/user.ts";
import {ConfigProvider, Spin, theme} from "antd";
import {StyleProvider} from "@ant-design/cssinjs";


const MainApp = () => {
    const isDarkMode = useMainPageStore((state) => state.isDarkMode);
    const themeConfig = useMemo(() => {
        if (isDarkMode) {
            return {
                colorBgBase: '#1E2939',
                colorTextBase: '#fafafa',
                colorBgContainer: '#1E2939'
            }
        } else {
            return {}
        }
    }, [isDarkMode])
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        // 获取当前path，判断是不是login页面
        const path = window.location.pathname;
        if (!token && !path.includes('/login')) {
            localStorage.removeItem(TOKEN_KEY)
            window.location.href = '/login'
        }
    }, []);

    const routeFlatMap = useMainPageStore((state) => state.routeFlatMap);
    // const routeFlatMap:Record<string, RouteConfig> = {}

    const renderRoutes = (isFilterLayout: boolean) => {
        const mod = import.meta.glob('../pages/**/*.tsx');

        // 渲染路由，使用懒加载对应的组件
        const buildRoute = (path: string, key?: string) => {
            let Component;
            if (key) {
                const moduleLoader = mod[`../pages/${key}/index.tsx`] || mod[`../pages/${key}.tsx`];
                if (moduleLoader) {
                    Component = React.lazy(() => moduleLoader() as Promise<{ default: React.ComponentType<any> }>);
                } else {
                    Component = React.lazy(() => import('../pages/ErrorPage/404'));
                }
            } else {
                Component = React.lazy(() => import('../pages/ErrorPage/BlankPage'));
            }
            return (
                <Route key={path} path={path}
                       element={
                           <React.Suspense
                               fallback={<Spin className={'w-full h-screen items-center justify-center flex'}/>}>
                               <Component/>
                           </React.Suspense>
                       }
                />
            );
        };

        const elements: JSX.Element[] = []

        for (const key of Object.keys(routeFlatMap)) {
            const route = routeFlatMap[key]
            //特殊页面如，登录等，不在主要布局内显示
            if (isFilterLayout) {
                if (route.noLayout) {
                    elements.push(buildRoute(route.path, route.pageKey))
                }
            } else {
                if (!route.noLayout) {
                    elements.push(buildRoute(route.path, route.pageKey))
                }
            }
        }

        return elements;
    }

    return (

        <StyleProvider layer>
            <ConfigProvider
                theme={{algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, token: themeConfig}}>
                <div className="flex flex-col h-screen w-full bg-gray-100">
                    <Router>
                        <Routes>
                            <Route path="/" element={<MainLayout/>}>
                                {renderRoutes(false)}
                            </Route>
                            {renderRoutes(true)}
                        </Routes>
                    </Router>
                </div>
            </ConfigProvider>
        </StyleProvider>
    );
};


export default MainApp;
