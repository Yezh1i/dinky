import {Outlet, useLocation, useNavigate} from "react-router";
// import { useMainPageStore } from "../store/MainPageStore";
import { useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useMainPageStore } from "../store/MainPageStore";

const MainLayout = () => {
    const location = useLocation();
    const sideMenuRoutes = useMainPageStore((state) => state.sideMenuRoutes);
    const navigate = useNavigate();
    useEffect(() => {
        useMainPageStore.getState().onPathChange(location.pathname);
    }, [location.pathname])

    return (
        <>
            <Header title="Dinky" navigate={navigate} />
            <div className="flex flex-1 overflow-hidden">
                {sideMenuRoutes && sideMenuRoutes.length > 0 && <Sidebar />}
                <div className="p-4 w-full">
                    <div className="bg-white">
                        <Outlet /> {/* 子路由渲染区域 */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout;
