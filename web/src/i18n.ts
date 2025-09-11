import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';


// 为你的命名空间创建类型定义
declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: typeof import('@/config/i18n/zh/common.json');
            // 添加其他命名空间的类型定义
        };
    }
}
interface I18nResource {
    [key: string]: string | I18nResource;
}
/**
 * 动态加载指定语言的所有命名空间资源
 * @param language 语言代码 (如: 'en', 'zh')
 * @returns Promise<Record<string, any>> 返回该语言的所有命名空间资源
 */
export async function loadLanguageResources(language: string): Promise<Record<string, I18nResource>> {
    const resources: Record<string, I18nResource> = {};
    try {
        // 动态导入所有JSON文件
        const modules = import.meta.glob('/src/config/i18n/*/*.json');

        for (const path in modules) {
            // 解析路径获取语言和命名空间
            const pathMatch = path.match(/\/src\/config\/i18n\/(.*?)\/(.*?)\.json$/);
            if (pathMatch) {
                const [, pathLanguage, namespace] = pathMatch;
                // 只加载当前语言的资源
                if (pathLanguage === language) {
                    try {
                        const module = await modules[path]() as I18nResource;
                        // 按命名空间组织资源
                        // 替换第41行代码为以下内容：
                        const resource = module.default || module;
                        if (typeof resource === 'object' && resource !== null) {
                            resources[namespace] = resource as I18nResource;
                        } else {
                            console.warn(`Resource for namespace "${namespace}" is not a valid object.`);
                        }
                    } catch (error) {
                        console.warn(`Failed to load resource: ${path}`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Failed to load language resources for ${language}:`, error);
    }

    return resources;
}

/**
 * 获取所有可用的命名空间
 * @returns Promise<string[]> 返回所有命名空间列表
 */
export async function getAvailableNamespaces(): Promise<string[]> {
  const namespaces = new Set<string>();

  try {
    const modules = import.meta.glob('/src/config/i18n/*/*.json');

    for (const path in modules) {
      const pathMatch = path.match(/\/src\/config\/i18n\/(.*?)\/(.*?)\.json$/);
      if (pathMatch) {
        const [, , namespace] = pathMatch;
        namespaces.add(namespace);
      }
    }
  } catch (error) {
    console.error('Failed to get available namespaces:', error);
  }

  return Array.from(namespaces);
}

/**
 * 初始化所有语言资源
 * @returns Promise<Record<string, Record<string, any>>> 返回所有语言的资源
 */
export async function initializeAllLanguageResources(): Promise<Record<string, Record<string, I18nResource>>> {
  const allResources: Record<string, Record<string, I18nResource>> = {};

  // 获取支持的语言列表
  const languages = Object.keys(supportedLanguages);

  // 并行加载所有语言资源
  const loadPromises = languages.map(async (language) => {
    const resources = await loadLanguageResources(language);
    return { language, resources };
  });

  const results = await Promise.all(loadPromises);

  // 组织资源结构
  results.forEach(({ language, resources }) => {
    allResources[language] = resources;
  });

  return allResources;
}

// 支持的语言列表
export const supportedLanguages = {
  en: 'English',
  zh: '中文'
};

// 异步初始化i18next
export const initializeI18n = async () => {
  // 加载所有语言资源
  const allResources = await initializeAllLanguageResources();
  // 获取可用的命名空间
  const namespaces = await getAvailableNamespaces();

  // 初始化i18next
  await i18n
    .use(LanguageDetector) // 自动检测用户语言
    .use(initReactI18next) // 绑定react-i18next
    .init({
      resources: allResources,
      fallbackLng: 'zh', // 回退语言
      debug: process.env.NODE_ENV === 'development', // 开发环境开启调试
      // 命名空间配置
      defaultNS: namespaces[0] || 'common', // 使用第一个命名空间作为默认
      ns: namespaces.length > 0 ? namespaces : ['common'], // 使用动态获取的命名空间
      // 键分隔符
      keySeparator: '.',
      nsSeparator: ':'
    });

  return i18n;
};

/**
 * 自定义翻译Hook
 * @param namespace 命名空间，默认为 'common'
 * @returns 翻译函数和相关工具
 */
export const useI18n = (namespace: string = 'common') => {
  const { t, i18n } = useTranslation(namespace);
  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    isReady: i18n.isInitialized
  };
};

export default i18n;
