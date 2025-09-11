import {Suspense, useEffect, useMemo} from "react";
import {I18nextProvider} from "react-i18next";
import i18n, {initializeI18n} from "../src/i18n";
import type {StoryContext} from "@storybook/react-vite";
import {PageLoading} from "@ant-design/pro-components";
import "../src/global.css";
import {useMainPageStore} from "../src/store/MainPageStore";
import {ConfigProvider,theme as antdTheme} from "antd";
import {StyleProvider} from "@ant-design/cssinjs";

export const globalTypes = {
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        toolbar: {
            icon: 'globe',
            items: [
                {value: 'zh', title: '中文'},
                {value: 'en', title: 'English'},
            ],
            showName: true,
        },
    },
};
// // When The language changes, set the document direction
i18n.on('languageChanged', (locale) => {
    const direction = i18n.dir(locale);
    document.dir = direction;
});

// Wrap your stories in the I18nextProvider component
const i18nextStoryDecorator = (Story: React.ComponentType, context: StoryContext) => {
    const {locale, backgrounds: {value}} = context.globals;
    const {theme} = context.parameters
    const isDarkMode = useMemo(() => {
        return theme === 'dark'
    }, [theme])
    const themeConfig = useMemo(() => {
        if (isDarkMode) {
            return {
                colorBgBase: '#1E2939',
                colorTextBase: '#fafafa',
                colorBgContainer:'1E2939'
            }
        } else {
            return {}
        }
    }, [isDarkMode])
    const switchTheme = useMainPageStore((state) => state.switchTheme);
    useEffect(() => {
        switchTheme(theme)
    }, [theme]);
    // When the locale global changes
    // Set the new locale in i18n
    useEffect(() => {
        initializeI18n().then(() => {
            i18n.changeLanguage(locale);
        })
    }, [locale]);

    return (
        // here catches the suspense from components not yet ready (still loading translations)
        // alternative set useSuspense false on i18next.options.react when initializing i18next
        <Suspense fallback={<PageLoading/>}>
            <I18nextProvider i18n={i18n}>
                <StyleProvider layer>
                    <ConfigProvider
                        theme={{
                            algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                            token: themeConfig
                        }}>
                        <Story/>
                    </ConfigProvider>
                </StyleProvider>
            </I18nextProvider>

        </Suspense>
    );
};

// export decorators for storybook to wrap your stories in
export const decorators = [i18nextStoryDecorator];
