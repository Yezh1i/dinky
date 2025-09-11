import { useLocation } from "react-router";
import { useI18n } from "@/i18n.ts";

const Demo1 = () => {
    const location = useLocation();
    const { t: tCommon } = useI18n('common');
    const { t: tMenu } = useI18n('menu');

    return (
        <div>
            <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-sky-800 dark:text-sky-300">
                        {tMenu('demo1')} - {tCommon('home')}
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            {tCommon('loading')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            {tCommon('success')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            当前页面: {location.pathname}
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                                {tCommon('save')}
                            </button>
                            <button className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
                                {tCommon('cancel')}
                            </button>
                            <button className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
                                {tCommon('submit')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Demo1;
