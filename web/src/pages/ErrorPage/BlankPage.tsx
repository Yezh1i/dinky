
import React from 'react';
import { Menu, Home } from 'lucide-react';

const BlankPage = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 菜单图标 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <Menu className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <div className="w-16 h-1 bg-gray-400 mx-auto rounded-full"></div>
        </div>
        
        {/* 提示信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            未选择菜单
          </h2>
          <p className="text-gray-600 leading-relaxed">
            您还没有选择任何菜单项。
            <br />
            请从左侧菜单中选择一个功能开始使用。
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
        </div>
        
        {/* 装饰动画 */}
        <div className="mt-12">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;