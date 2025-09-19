/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
import type {LayoutBase} from 'rc-dock/src/DockData';
import React from "react";


export type Toolbar = {
    key: string,
    title: string,
    icon: React.ReactNode,
    component: React.ReactElement,
    position: 'left' | 'right' | 'bottom'
}

export type ToolbarState = Record<Toolbar['position'], {
    open?: string|null,
    size: number,
    toolbars: string[]
}>

export type ToolbarSelect = {
    // 当前选中的tab
    currentSelect?: string;
    // 所有打开的tab
    allOpenTabs: string[];
    allTabs: string[];
};
/**
 * @description:
 *  zh: 中间tab 类型
 *  en: Center tab type
 */
export type CenterTabType = 'web' | 'task' | 'dataSource';

/**
 * @description:
 *  zh: 中间 tab 信息
 *  en: Center tab informations
 */
export type CenterTab = {
    id: string;
    /**
     * zh: tab 类型
     * en: tab Type
     */
    tabType: CenterTabType;
    /**
     * zh: tab 标题
     * en: tab title
     */
    title: string;
    /**
     * zh: tab 是否存在更新
     * en: tab is updated
     */
    isUpdate: boolean;
    /**
     * zh: tab 参数
     * en: tab params
     */
    params: Record<string, any>;
};

/**
 * @description:
 *  zh: 布局状态
 *  en: Layout state
 */
export type DataStudioState = {
    /**
     * zh: 基础布局数据
     * en: Basic layout data
     */
    layoutData: LayoutBase;
    layoutSize: {
        leftTop: number;
        leftBottom: number;
        right: number;
        centerContent?: number | undefined;
    };
    /**
     * zh: 工具栏布局
     * en: Toolbar layouts
     */
    toolbar: {
        /**
         * zh: 是否显示描述
         * en: Whether to show descriptions
         */
        showDesc: boolean;
        /**
         * zh: 是否显示激活的tab
         * en: Whether to show the active tabs
         */
        showActiveTab: boolean;
        /**
         * zh: 左上角的tab
         * en: Left top tab
         */
        leftTop: ToolbarSelect;
        /**
         * zh: 左下角的tab
         * en: Left bottom tab
         */
        leftBottom: ToolbarSelect;
        /**
         * zh: 右边的tab
         * en: Right tabs
         */
        right: ToolbarSelect;
        /**
         * zh: 中间内容
         * en: Center contents
         */
        centerContent: ToolbarSelect;
    };

    /**
     * zh: 中间内容 tab 列表
     * en: Center content tab list
     */
    centerContent: {
        /**
         * zh: tab 列表
         * en: Tab list
         */
        tabs: CenterTab[];
        /**
         * zh: 激活的tab
         * en: Active tab
         */
        activeTab?: string | undefined;
    };
};
