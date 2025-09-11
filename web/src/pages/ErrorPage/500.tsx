import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

const Error500 = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen   flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 错误图标和数字 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="w-24 h-24 text-red-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">!</span>
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>
        
        {/* 错误信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            服务器内部错误
          </h2>
          <p className="text-gray-600 leading-relaxed">
            抱歉，服务器遇到了一个错误，无法完成您的请求。
            <br />
            我们正在努力修复这个问题，请稍后再试。
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            刷新页面
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
        </div>
        
        {/* 状态指示器 */}
        <div className="mt-12">
          <div className="flex justify-center items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-sm">系统状态检测中...</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error500;