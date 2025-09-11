import { IconDemo } from '../icons/IconDemo';
import type { RouteConfig } from '../store/MainPageStore';

// 路由列表
export const routes: RouteConfig[] = [
    {
        path: '/',
        name: "首页",
        icon: <IconDemo />,
        pageKey: "ErrorPage/200",
        // hideInMenu: true,
    },
    {
        path: '/test1',
        name: 'menu:menu.err_test.title',
        icon: <IconDemo />,
        routes: [
            {
                path: '/test1/404',
                name: 'menu:menu.err_test.404',
                pageKey: "ErrorPage/404",
                icon: <IconDemo />,
            },
            {
                path: '/test1/403',
                name: 'menu:menu.err_test.403',
                pageKey: "ErrorPage/403",
                icon: <IconDemo />,
            },
            {
                path: '/test1/500',
                name: 'menu:menu.err_test.500',
                pageKey: "ErrorPage/500",
                icon: <IconDemo />,
            },
            {
                path: '/test1/200',
                name: 'menu:menu.err_test.200',
                pageKey: "ErrorPage/200",
                icon: <IconDemo />,
            }
        ]
    },
    {
        path: '/test2',
        name: '测试页2',
        icon: <IconDemo />,
        routes: [
            {
                path: '/test2/item',
                name: '子菜单2-1',
                pageKey: "Demo1",
                icon: <IconDemo />,
            },
            {
                path: '/test2/item2',
                name: '子菜单2-2',
                pageKey: "Demo1",
                icon: <IconDemo />,
            },
            {
                path: '/test2/item3',
                name: '子菜单2-3',
                pageKey: "Demo1",
                icon: <IconDemo />,
                routes: [
                    {
                        path: '/test2/item3/child',
                        name: '子菜单2-3-1',
                        pageKey: "Demo1",
                        icon: <IconDemo />,
                    },
                ]
            },
            {
                path: '/login',
                name: '登录',
                pageKey: "Login",
                noLayout: true
            },
            {
                path: '*',
                name: '404',
                pageKey: "ErrorPage/404",
                noLayout: true
            },
        ]
    },

];
