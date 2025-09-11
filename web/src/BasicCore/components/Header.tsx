import React from 'react';
import {Bell, Moon, Sun, LogOut} from 'lucide-react';
import imagePng from '@/assets/image.png';
import {type RouteConfig, useMainPageStore} from '@/store/MainPageStore';
import LanguageSwitcher from './LanguageSwitcher';
import {useI18n} from '@/i18n.ts';
import {Avatar, Button, Card, Dropdown, Menu, type MenuProps as AntdMenuProps} from "antd";
import type {MenuItemType} from "antd/es/menu/interface";
import {routes} from "@/config/route.tsx";

interface HeaderProps {
    title?: string;
    navigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({
                                           title = 'Dinky', navigate = (_) => {
    }
                                       }) => {
    const {t} = useI18n();
    const activeKeys = useMainPageStore((state) => state.activeKeys);
    const isDarkMode = useMainPageStore((state) => state.isDarkMode);
    const toggleDarkMode = useMainPageStore((state) => state.toggleDarkMode);

    const handleMenuClick = (key: string) => {
        navigate(key);
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-6">
                <div className="flex items-center justify-between">
                    {/* 左侧区域：标题 + 菜单导航 */}
                    <div className="flex items-center space-x-8">
                        {/* 标题 */}
                        <div className="flex items-center space-x-3">
                            <img src={imagePng} alt="Logo" className="w-12 h-12 object-contain"/>
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
                        </div>


                    </div>
                    {/* 菜单导航 */}
                    <div className="nav-wrapper flex  justify-center ">
                        <Menu onClick={(e) => handleMenuClick(e.key)} selectedKeys={activeKeys} className="flex"
                              mode="horizontal" items={convertToMenuItems(Object.values(routes), t)}/>
                    </div>

                    {/* 右侧通知和用户区域 */}
                    <div className="flex items-center space-x-4">
                        {/* 语言切换 */}
                        <LanguageSwitcher/>

                        {/* 暗色模式切换 */}
                        <Button className=" transform hover:-translate-y-1 transition duration-400"
                                onClick={toggleDarkMode} icon={isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
                                title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}/>

                        {/* 通知 */}
                        <Button title={t('header.notifications')} icon={<Bell size={20}/>}/>

                        {/* 用户 */}
                        <Dropdown popupRender={() => <Card className="w-64" size={"small"}>
                            <div className='space-y-6'>
                                <div className="flex flex-row items-center justify-start space-x-2">
                                    <Avatar style={{verticalAlign: 'middle'}} size="large" gap={4}>
                                        admin
                                    </Avatar>
                                    <div className="flex-col">
                                        <div className="">admin</div>
                                        <div className="text-gray-500">账号ID：14332223</div>
                                    </div>
                                </div>
                                <Button
                                    className='w-full'
                                    onClick={() => navigate("/login")}
                                    title={t('header.logout')}
                                    icon={<LogOut size={20}/>}
                                    color={'default'}
                                    variant={'filled'}
                                >
                                    退出登录
                                </Button>
                            </div>
                        </Card>}>
                            <Avatar style={{verticalAlign: 'middle'}} gap={1} className="cursor-pointer">
                                admin
                            </Avatar>
                        </Dropdown>
                    </div>
                </div>
            </div>

        </header>
    );
};

export const convertToMenuItems = (items: RouteConfig[], t: (key: string) => string): AntdMenuProps['items'] => {
    const convertItems = (routes: RouteConfig[]): AntdMenuProps['items'] => {
        return routes
            .filter(route => !route.hideInMenu)
            .filter(route => !route.noLayout)
            .map(item => {
                const baseItem: MenuItemType = {
                    key: item.path,
                    label: t(`${item.name}`),
                    icon: item.icon,
                    // @ts-ignore
                    popupClassName: 'nav-wrapper'
                };

                // 递归处理多层子路由
                if (item.routes && item.routes.length > 0) {
                    return {
                        ...baseItem,
                        children: convertItems(item.routes)
                    };
                }

                return baseItem;
            });
    };

    return convertItems(items);
};

export default Header;
