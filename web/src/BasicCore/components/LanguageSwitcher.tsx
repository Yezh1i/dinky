import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { supportedLanguages, useI18n } from '../../i18n';
import {Button, Dropdown} from "antd";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    return supportedLanguages[language as keyof typeof supportedLanguages] || language;
  };

  return (

      <Dropdown trigger={['click']} menu={{items: Object.entries(supportedLanguages).map(([code, name]) => ({
              key: code,
              label: name,
              onClick: () => handleLanguageChange(code),
              icon: language === code && <div className="w-2 h-2 bg-blue-500 rounded-full" />,
          })),activeKey: language,}}>
          <Button  onClick={() => setIsOpen(!isOpen)} title="切换语言 / Switch Language" icon={ <Globe size={20} />}  >
             <span className="text-sm font-medium hidden sm:inline">
          {getCurrentLanguageName()}
        </span>
          </Button>
      </Dropdown>
    // <div className={`relative ${className}`}>
    //   {/* 语言切换按钮 */}
    //
    //
    //   {/* 语言选择下拉菜单 */}
    //   {isOpen && (
    //     <>
    //       {/* 遮罩层 */}
    //       <div
    //         className="fixed inset-0 z-10"
    //         onClick={() => setIsOpen(false)}
    //       />
    //
    //       {/* 下拉菜单 */}
    //       <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
    //         <div className="py-1">
    //           {Object.entries(supportedLanguages).map(([code, name]) => (
    //             <button
    //               key={code}
    //               onClick={() => handleLanguageChange(code as string)}
    //               className={`w-full text-left px-4 py-2 text-sm transition-colors ${
    //                 language === code
    //                   ? 'bg-blue-50 text-blue-700 font-medium'
    //                   : 'text-gray-700 hover:bg-gray-50'
    //               }`}
    //             >
    //               <div className="flex items-center justify-between">
    //                 <span>{name}</span>
    //                 {language === code && (
    //                   <div className="w-2 h-2 bg-blue-500 rounded-full" />
    //                 )}
    //               </div>
    //             </button>
    //           ))}
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

export default LanguageSwitcher;
