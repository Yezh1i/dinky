import {DockLayout, type DropDirection, type PanelData, type TabBase, type TabData} from "rc-dock";
import {Content} from "antd/es/layout/layout";
import {Suspense, useEffect, useRef, useState} from "react";
import type {LayoutBase} from "rc-dock/src/DockData.ts";
import {getToolbarMapByKey} from "@/pages/DataStudio/toolbar.tsx";
import {useDataStudioStore} from "@/store/DataStudioStore.tsx";
import {Button} from "antd";
import {BorderOutlined, MinusOutlined} from "@ant-design/icons";
import KeepAlive, {AliveScope} from "react-activation";

const tab = {
    closable: false,
    group: "toolbar",
    cached: true,
};

const Dock = () => {
    const toolbarState = useDataStudioStore(state => state.toolbar);
    const setToolbarShow = useDataStudioStore(state => state.setToolbarShow);
    const setToolbarSize = useDataStudioStore(state => state.setToolbarSize);

    const [layout, setLayout] = useState<LayoutBase>({
        dockbox: {
            mode: 'horizontal',
            children: [
                {
                    id: "main",
                    tabs: [
                        {
                            ...tab, id: 't5', group: "main"
                        }
                    ],
                    group: "main",
                    panelLock: {panelStyle: 'main', minWidth: 300, widthFlex: 200, minHeight: 30},
                }
            ]
        }
    })

    useEffect(() => {
        const dockbox = layout.dockbox;
        console.log(dockbox)
        if (toolbarState.right.open) {
            const panel = {
                tabs: [{...tab, id: 't-r'}],
                group: "toolbar",
                id: 'toolbar-right',
                size: toolbarState.right.size,
                panelLock: {panelStyle: 'toolbar-right', minWidth: 300, minHeight: 30, widthFlex: 80},
            }
            if (dockbox.mode == "horizontal") {
                dockbox.children.push(panel)
                setLayout({...layout})
                return
            } else {
                dockbox.children[0] = {
                    mode: 'horizontal',
                    children: [dockbox.children[0], panel]
                }
                setLayout({...layout})
                return
            }
        }
        if (!toolbarState.right.open) {
            const tab = dockLayoutRef.current?.find("toolbar-right");
            if (tab) {
                dockLayoutRef.current?.dockMove(tab as TabData, null,
                    "remove"
                )
                return;
            }
        }
    }, [toolbarState.right.open]);
    useEffect(() => {
        const dockbox = layout.dockbox;

        if (toolbarState.left.open) {
            const panel = {
                tabs: [{...tab, id: 't-l'}],
                group: "toolbar",
                id: 'toolbar-left',
                size: toolbarState.left.size,
                panelLock: {panelStyle: 'toolbar-left', minWidth: 300, minHeight: 30, widthFlex: 80},
            }
            if (dockbox.mode == "horizontal") {
                dockbox.children = [panel, ...dockbox.children]
                setLayout({...layout})
                return
            } else {
                dockbox.children[0] = {
                    mode: 'horizontal',
                    children: [panel, dockbox.children[0]]
                }
                setLayout({...layout})
                return
            }
        }
        if (!toolbarState.left.open) {
            const tab = dockLayoutRef.current?.find("toolbar-left");
            if (tab) {
                dockLayoutRef.current?.dockMove(tab as TabData, null,
                    "remove"
                )
                return;
            }
        }
    }, [toolbarState.left.open]);
    useEffect(() => {
        const dockbox = layout.dockbox;

        if (toolbarState.bottom.open) {
            const panel = {
                mode: 'vertical',
                tabs: [{...tab, id: 't-b'}],
                group: "toolbar",
                id: 'toolbar-bottom',
                size: toolbarState.bottom.size,
                panelLock: {panelStyle: 'toolbar-bottom', heightFlex: 20, minHeight: 30},
            };
            if (dockbox.mode == "horizontal") {
                dockbox.children = [{...dockbox}, panel]
                dockbox.mode = "vertical"
                console.log(dockbox)
                setLayout({...layout})
                return;
            }
            if (dockbox.mode == "vertical") {
                console.log(dockbox)
                dockbox.children.push(panel)
                setLayout({...layout})
                return;
            }
        }
        if (!toolbarState.bottom.open) {
            const tab = dockLayoutRef.current?.find("toolbar-bottom");
            if (tab) {
                dockLayoutRef.current?.dockMove(tab as TabData, null,
                    "remove"
                )
                return;
            }
        }
    }, [toolbarState.bottom.open]);

    const dockLayoutRef = useRef<DockLayout>(null)

    const onLayoutChange = (newLayout: LayoutBase, currentTabId?: string, direction?: DropDirection) => {
        console.log(newLayout)
        if (direction === "remove" || direction === "maximize") {
            setLayout(newLayout)
            return;
        }

        if (currentTabId?.startsWith("toolbar")) {
            return;
        }

        if (currentTabId) {
            const container = dockLayoutRef.current?.find(currentTabId);

            // 判断是不是Panel
            if (container && typeof container === 'object' && 'tabs' in container.parent) {
                const parent = container.parent as PanelData;
                if (parent.group === "toolbar") {
                    return;
                }
            }
            const dockbox = newLayout.dockbox;
            // 判断main是否在其他box下面
            if (container?.group === "main" || container?.parent?.group === "main") {
                console.log(12312, dockbox)
                if (dockbox.mode === "horizontal") {
                    if (toolbarState.left.open) {
                        if (dockbox.children[0].id !== "toolbar-left") {
                            setLayout({...layout})
                            return;
                        }
                    }
                    if (toolbarState.right.open) {
                        if (dockbox.children[dockbox.children.length - 1].id !== "toolbar-right") {
                            setLayout({...layout})
                            return;
                        }
                    }
                }
                if (dockbox.mode === "vertical") {

                }

            }
            if (direction == "left" || direction == "right" || direction == "top" || direction == "bottom") {
                if (dockbox.mode === "vertical") {
                    if (!toolbarState.bottom.open) {
                        setLayout({...layout})
                        return;
                    }
                    if (dockbox.children.length > 2) {
                        setLayout({...layout})
                        return;
                    }
                }
                if (dockbox.mode === "horizontal") {
                    // 判断底部容器是否存在
                    if (toolbarState.bottom.open) {
                        setLayout({...layout})
                        return;
                    }

                }
            }
        }

        setLayout(newLayout);
    };
    const loadTab = (data: TabBase): TabData => {
        const {id,key} = data;
        return {
            ...data,
            id, title: id,
            content: <KeepAlive cacheKey={key as string} autoFreeze={false}>
                {getToolbarMapByKey["catalog"].component}
            </KeepAlive>
        };
    };

    return (
        <Content>
            <AliveScope>
                <DockLayout
                    ref={dockLayoutRef}
                    onLayoutChange={onLayoutChange}
                    groups={
                        {
                            "toolbar": {
                                disableDock: false,
                                tabLocked: true,
                                panelExtra: (panel, context) => {
                                    return (
                                        <div>
                                            <Button className="bg-transparent" icon={<MinusOutlined/>} onClick={() => {
                                                if (panel.id === "toolbar-left") {
                                                    toolbarState.left.open = null;
                                                    setToolbarShow("left", null)
                                                }
                                                context.dockMove(panel, null, 'remove')
                                            }}/>
                                            <Button className="bg-transparent" icon={<BorderOutlined/>} onClick={() => {
                                                context.dockMove(panel, null, 'maximize')
                                            }}/>
                                        </div>
                                    )
                                }
                            }
                        }
                    }
                    // dropMode={"edge"}
                    loadTab={loadTab}
                    saveTab={(tab) => tab}
                    layout={layout}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    afterPanelSaved={(panel) => {
                        const size = panel.size ?? 300;
                        if (panel.id == "toolbar-right") {
                            setToolbarSize("right", size)
                        } else if (panel.id == "toolbar-left") {
                            setToolbarSize("left", size)
                        } else if (panel.id == "toolbar-bottom") {
                            setToolbarSize("bottom", size)
                        }
                    }}
                />
            </AliveScope>
        </Content>

    )
}

export default Dock;
