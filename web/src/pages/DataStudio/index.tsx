import {Flex, Layout, Typography, theme, Button, Tooltip} from "antd";
import {ReactSortable} from "react-sortablejs";
import "rc-dock/dist/rc-dock.css";
import React, {type MouseEventHandler, useCallback, useMemo} from "react";
import {getToolbarMapByKey} from "@/pages/DataStudio/toolbar.tsx";
import type {Toolbar, ToolbarState} from "@/pages/DataStudio/type.ts";
import Dock from "@/pages/DataStudio/dock.tsx";
import {useDataStudioStore} from "@/store/DataStudioStore.tsx";

const {useToken} = theme;



const DataStudio = () => {
    const {token} = useToken();
    const state = useDataStudioStore(state => state);
    const updateToolbar = useCallback((position: Toolbar['position'], toolbar: ToolbarState[Toolbar['position']]) => {
        state.setToolbar(position,toolbar)
    }, [state])

    return (
        <Layout style={{margin: -16}} className={"bg-white"}>
            <Layout className="flex-row bg-transparent">
                <DataStudioSider className="border-r flex justify-center">
                    <div className="flex flex-col justify-between">
                        <DataStudioSliderToolbar toolbarState={state.toolbar} position={'left'}
                                                 updateToolbar={updateToolbar}/>
                        <DataStudioSliderToolbar className={"justify-end"} toolbarState={state.toolbar}
                                                 position={'bottom'}
                                                 updateToolbar={updateToolbar}/>
                    </div>
                </DataStudioSider>
                <Dock/>
                <DataStudioSider className="border-l">
                    <DataStudioSliderToolbar toolbarState={state.toolbar} position={'right'}
                                             updateToolbar={updateToolbar}/>

                </DataStudioSider>
            </Layout>
            <Flex className=" flex p-0 h-8 items-center justify-between px-4 border-t"
                  style={{borderColor: token.colorBorder}}>
                <div>
                    WelCome to Dinky!
                </div>
                <div className="space-x-2">
                    <Typography.Text>最近保存：11点23</Typography.Text>
                    <Typography.Text>11m/1024m</Typography.Text>
                </div>

            </Flex>
        </Layout>
    )
}

const DataStudioSider = (props: { className?: string, children?: React.ReactNode }) => {
    const {token} = useToken();
    const {className, children} = props;
    return (
        <div className={`w-12 h-full ${className}`}
             style={{backgroundColor: 'transparent', borderColor: token.colorBorder}}>
            {children}
        </div>
    )
};
const DataStudioSliderToolbar = (props: {
    className?: string,
    toolbarState: ToolbarState,
    position: Toolbar['position'],
    updateToolbar: (position: Toolbar['position'], toolbar: ToolbarState[Toolbar['position']]) => void
}) => {
    const {className, toolbarState, updateToolbar, position} = props;
    const toolbar = useMemo(() => toolbarState[position], [toolbarState, position]);
    const onClick = useCallback((key: string) => {
        if (key === toolbar.open) {
            updateToolbar(position, {
                open: null,
                toolbars: toolbar.toolbars
            })
        } else {
            updateToolbar(position, {
                open: key,
                toolbars: toolbar.toolbars
            })
        }
    }, [updateToolbar, position, toolbar.open, toolbar.toolbars]);

    return (
        <ReactSortable className={`flex flex-col items-center space-y-1 py-1 h-full ${className}`} group={"toolbar"}
                       swap
                       list={toolbar.toolbars?.map((item) => ({id: item}))}
                       setList={(newList) => {
                           const newToolbarList = newList.map(item => item.id);
                           const difference = newList.filter(item => !toolbar.toolbars.includes(item.id));
                           const difference2 = toolbar.toolbars.filter(item => !newToolbarList.includes(item));
                           //todo 改变对应的dock panel
                           if (difference.length == 1 || difference2.length == 1) {
                               const open = difference.length == 1 ? null : toolbar.open;
                               updateToolbar(position, {
                                   open: open,
                                   toolbars: newToolbarList
                               })
                           } else if (newToolbarList.length == toolbar.toolbars.length) {
                               updateToolbar(position, {
                                   open: toolbar.open,
                                   toolbars: newToolbarList
                               })
                           }
                       }}
        >
            {toolbar.toolbars?.map((key) => (
                <DataStudioSiderButton onClick={() => onClick(key)} active={toolbar.open === key} key={key}
                                       icon={getToolbarMapByKey[key]?.icon} title={getToolbarMapByKey[key]?.title}/>
            ))}
        </ReactSortable>
    )
};

const DataStudioSiderButton = (props: {
    active?: boolean,
    icon: React.ReactNode,
    title: string,
    onClick?: MouseEventHandler<HTMLHtmlElement> | undefined
}) => {
    const {active, icon, title, onClick} = props;
    return (
        <Tooltip title={title} mouseEnterDelay={1.5}>
            <Button icon={icon} onClick={onClick} classNames={{icon: "text-xl"}} color={"default"}
                    variant={active ? "filled" : "link"}
                    size={"large"}/>
        </Tooltip>
    )

}

export default DataStudio;
