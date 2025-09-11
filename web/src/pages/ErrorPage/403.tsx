import React from 'react';
import { Lock, Home, LogIn } from 'lucide-react';

const Error403 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    // 这里可以跳转到登录页面
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen   flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 锁定图标和数字 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">×</span>
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-orange-600 mb-4">403</h1>
          <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
        </div>
        
        {/* 错误信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            访问被禁止
          </h2>
          <p className="text-gray-600 leading-relaxed">
            抱歉，您没有权限访问此页面。
            <br />
            请确认您已登录并具有相应的访问权限。
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-5 h-5 mr-2" />
            重新登录
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
        </div>
        
        {/* 权限提示 */}
        <div className="mt-12">
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-orange-700">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">需要相应权限才能访问</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error403;