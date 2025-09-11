import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const Error404 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen   flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 大号数字 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        
        {/* 错误信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600 leading-relaxed">
            抱歉，您访问的页面不存在或已被移动。
            <br />
            请检查URL是否正确，或返回首页继续浏览。
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
          
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回上页
          </button>
        </div>
        
        {/* 装饰元素 */}
        <div className="mt-12 opacity-20">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;