import {create} from "zustand";
import {routes} from "../config/route";


// 路由类型定义
export interface RouteConfig {
    path: string;
    name: string;
    icon?: React.ReactNode;
    pageKey?: string;
    routes?: RouteConfig[];
    hideInMenu?: boolean;
    noLayout?: boolean;
}

type IMainPageStore = {
    routeFlatMap: Record<string, RouteConfig>;
    sideMenuRoutes?: RouteConfig[]; // 侧边栏路由列表
    activeKeys: string[]; // 路由菜单激活项
    currentRoute: RouteConfig
    isDarkMode: boolean; // 暗色模式状态
    onPathChange: (path: string) => void; // 路径改变时触发的回调函数
    toggleDarkMode: () => void; // 切换暗色模式
    switchTheme: (theme: string) => void;
}

// 创建路由扁平化映射的辅助函数
const createRouteFlatMap = (routes: RouteConfig[]): Record<string, RouteConfig> => {
    const flatMap: Record<string, RouteConfig> = {};
    const flatten = (routeList: RouteConfig[]) => {
        routeList.forEach(route => {
            flatMap[route.path] = route;
            if (route.routes) {
                flatten(route.routes);
            }
        });
    };

    flatten(routes);
    return flatMap;
};


export const useMainPageStore = create<IMainPageStore>()((set, get): IMainPageStore => ({
        sideMenuRoutes: [],
        routeFlatMap: createRouteFlatMap(routes),
        activeKeys: [],
        currentRoute: routes[0],
        isDarkMode: false,
        onPathChange: (path: string) => {
            const pathSlice = path.split('/')
            if (pathSlice[0] === "") {
                pathSlice.shift();
            }
            //最外层是顶部菜单，下一层是侧边路由菜单，所以我们只取一层即可
            const sideRoute = get().routeFlatMap["/" + pathSlice[0]];
            //根据约定，path就是路由拼接的，所以我们这里穷举路由所有的字符串拼接就可以得到所有的菜单激活key
            const activeKeys: string[] = [];
            let tmp = ""
            for (const key of pathSlice) {
                tmp += "/" + key;
                activeKeys.push(tmp);
            }
            set(() => ({
                sideMenuRoutes: sideRoute?.routes?.filter(r => !r.noLayout && !r.hideInMenu),
                activeKeys: activeKeys,
                currentRoute: get().routeFlatMap[path]
            }))
        },
        toggleDarkMode: () => {
            set((state) => {
                const newDarkMode = !state.isDarkMode;
                // 更新HTML根元素的class来启用/禁用暗色模式
                if (newDarkMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return {isDarkMode: newDarkMode};
            });
        },
        switchTheme: (theme) => {
            set((_) => {
                if (theme === "dark") {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }

                return {isDarkMode: theme === "dark"};
            });
        },
    })
)
