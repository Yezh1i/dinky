import React, {useState} from 'react';
import {User, Lock, Eye, EyeOff, LogIn} from 'lucide-react';
import imagePng from '@/assets/image.png';
import {useI18n} from '@/i18n.ts';
import Lottie from 'react-lottie';
import DataPlatform from './login_animation.json';
import {Col, Flex, message, Row} from "antd";
import {Highlight} from "@/components/text/HightLight.tsx";
import {useRequest} from "ahooks";
import {login} from "@/api/user";
import type {Resp} from "@/api/resp.ts";
import {DefaultFooter} from '@ant-design/pro-components';
import {GithubOutlined} from '@ant-design/icons';


const Login = () => {

    return (
        <div className={'min-h-screen flex w-screen items-end'}
             style={{
                 backgroundImage: 'url(./imgs/login_background.jpg)',
                 backgroundSize: 'cover',
             }}>
            <div className=' absolute flex justify-center items-center top-1/2 w-full'
            style={{
                transform: 'translate(0%, -50%)',
            }}>
                <Row
                    style={{
                        width: '90%',
                        borderRadius: 15,
                        overflow: 'hidden',
                        boxShadow: '0px 0px 100px  #78909c'
                    }}
                >
                    <Col
                        className=' bg-white'
                        xs={24}
                        sm={24}
                        md={24}
                        lg={10}
                        xl={10}
                        xxl={8}
                    >
                        <LoginForm/>
                    </Col>
                    <Col
                        xs={0}
                        sm={0}
                        md={0}
                        lg={14}
                        xl={14}
                        xxl={16}
                        style={{
                            backgroundImage: 'linear-gradient(135deg,#1fa2ff,#12d8fa,#a6ffcb)'
                        }}
                    >
                        <Flex align={'center'} style={{width: '100%', height: '100%'}}>
                            <Lottie
                                options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: DataPlatform,
                                    rendererSettings: {
                                        preserveAspectRatio: 'xMidYMid slice'
                                    }
                                }}
                                height={'60%'}
                                width={'70%'}
                                speed={0.5}
                                isClickToPauseDisabled
                            />
                        </Flex>
                    </Col>
                </Row>
            </div>
                <img
                    src={'./imgs/footer-bg.svg'}
                    width={'100%'}
                    alt={''}
                />

        </div>
    );
};

const LoginForm = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const {t} = useI18n("user");
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const {run: loginRun, loading} = useRequest(login, {
        manual: true,
        onSuccess: async (data: Resp<unknown>) => {
            window.location.href = "/"
        },
        onError: async (error) => {
            await messageApi.error(error.message)
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        loginRun(formData.username, formData.password)
    };
    return (
        <div className=" w-full  h-full flex flex-col p-12">
            {contextHolder}
            {/* 登录卡片 */}
            {/* Logo和标题 */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4 items-center">
                    <img
                        src={imagePng}
                        alt="Logo"
                        className="w-36 h-36 object-contain"
                    />
                    <Highlight>
                        <h1 className="text-2xl font-bold p-2">{t('user:login.title')}</h1>
                    </Highlight>
                </div>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 用户名输入框 */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('login.username')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder={t('login.usernameRequired')}
                        />
                    </div>
                </div>

                {/* 密码输入框 */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('login.password')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder={t('login.passwordRequired')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute border-0 inset-y-0 right-0 pr-3 flex items-center bg-transparent"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
                            )}
                        </button>
                    </div>
                </div>

                {/* 记住我和忘记密码 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            {t('login.rememberMe')}
                        </label>
                    </div>
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                        {t('login.forgotPassword')}
                    </a>
                </div>

                {/* 登录按钮 */}
                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div
                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('common.loading')}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <LogIn className="w-4 h-4 mr-2"/>
                            {t('user:login.loginButton')}
                        </div>
                    )}
                </button>
            </form>

            {/* 分割线 */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Copyright</span>
                    </div>
                </div>
            </div>
            <DefaultFooter
                copyright={`${new Date().getFullYear()} ` + t('common:app.platform.copyright.produced')}
                style={{backgroundColor: '#fff'}}
                links={[
                    {
                        key: 'Dinky',
                        title: 'Dinky',
                        href: 'https://github.com/DataLinkDC/dinky',
                        blankTarget: true
                    },
                    {
                        key: 'github',
                        title: <GithubOutlined/>,
                        href: 'https://github.com/DataLinkDC/dinky',
                        blankTarget: true
                    }
                ]}
            />
        </div>
    )
}


export default Login;
