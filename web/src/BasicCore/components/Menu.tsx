import React from 'react';
import { useMainPageStore, type RouteConfig } from '../../store/MainPageStore';
import { useI18n } from '../../i18n';

interface MenuProps {
  items: RouteConfig[];
  onSelect?: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({ items, onSelect }) => {

  const activeKeys = useMainPageStore((state) => state.activeKeys);
  const { t } = useI18n("menu");

  const handleClick = (key: string) => {
    if (onSelect) {
      onSelect(key);
    }
  };

  const isActive = (key: string) => {
    return activeKeys.includes(key);
  }

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <div
          key={item.path}
          className={`p-2 hover:bg-sky-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors ${isActive(item.path)
              ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 font-medium'
              : 'text-sky-800 dark:text-sky-300'
            }`}
          onClick={() => handleClick(item.path)}
        >
          {t(`${item.name}`)}
          {item.routes && (
            <div className="pl-4 mt-1 space-y-1">
              {item.routes.map((child) => (
                <div
                  key={child.path}
                  className={`p-1 hover:bg-sky-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors ${isActive(child.path)
                      ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 font-medium'
                      : 'text-sky-700 dark:text-sky-400'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(child.path);
                  }}
                >
                  {t(`${child.name}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Menu;