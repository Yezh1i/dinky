import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './global.css'
import {initializeI18n} from './i18n.ts' // 导入异步初始化函数
import MainApp from './BasicCore/MainApp.tsx'
import '@ant-design/v5-patch-for-react-19';


// 异步初始化应用
const initApp = async () => {

    try {
        // 等待i18n初始化完成
        await initializeI18n();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }

    // 渲染应用
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            {/*<GlobalToast>*/}
            {/*<ToastInit/>*/}
            <MainApp/>
            {/*</GlobalToast>*/}
        </StrictMode>,
    );
};

// 启动应用
initApp();
