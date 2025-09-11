import React from 'react';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';

const Success200 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleContinue = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 成功图标和数字 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-green-600 mb-4">200</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        {/* 成功信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            操作成功！
          </h2>
          <p className="text-gray-600 leading-relaxed">
            恭喜！您的请求已成功处理。
            <br />
            系统已完成相关操作，您可以继续使用其他功能。
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            继续操作
          </button>
          
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </button>
        </div>
        
        {/* 成功动画 */}
        <div className="mt-12">
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-green-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success200;