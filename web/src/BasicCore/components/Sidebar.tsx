import React, {useState} from 'react';
// import Menu from './Menu';
import {useMainPageStore} from '../../store/MainPageStore';
import {useNavigate} from 'react-router';
import {Menu} from "antd";
import {convertToMenuItems} from "@/BasicCore/components/Header.tsx";
import {useI18n} from "@/i18n.ts";


const Sidebar: React.FC = () => {
    const {t} = useI18n();

    const [open, setOpen] = useState(false)
    const activeKeys = useMainPageStore((state) => state.activeKeys);

    const sideMenuRoutes = useMainPageStore((state) => state.sideMenuRoutes);


    const navigate = useNavigate();

    const handleMenuSelect = (key: string) => {
        navigate(key);
    };

    return (
        <aside className={`flex h-full `} onMouseEnter={() => setOpen(true)}
               onMouseLeave={() => setOpen(false)}>
            {/*<Menu items={sideMenuRoutes??[]} onSelect={handleMenuSelect} />*/}
            <Menu onClick={(e) => handleMenuSelect(e.key)} className={`${!open ? 'w-16' : 'w-56'}`}
                  selectedKeys={activeKeys}
                  inlineCollapsed={!open} mode="inline"
                  items={convertToMenuItems(Object.values(sideMenuRoutes ?? []), t)}/>
        </aside>
    );
};

export default Sidebar;
