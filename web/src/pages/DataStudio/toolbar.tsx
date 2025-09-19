import type {Toolbar} from "@/pages/DataStudio/type.ts";
import {ConsoleSqlOutlined, LeftOutlined, TableOutlined} from "@ant-design/icons";
import {useState} from "react";

const Project = () => {
    return (<></>)
};
const Test = () => {
    const [count, setCount] = useState(0)

    return (
        <div className="w-full h-full">
            <span>{count}</span>
            <button onClick={() => setCount(count + 1)}>点我+1</button>
        </div>
    )
};


export const toolbars: Toolbar[] = [
    {
        key: "project",
        title: "project",
        position: "left",
        icon: <ConsoleSqlOutlined/>,
        component: <Project/>
    },
    {
        key: "bottom-test1",
        title: "bottom-test1",
        position: "bottom",
        icon: <LeftOutlined/>,
        component: <Test/>
    },
    {
        key: "bottom-test2",
        title: "bottom-test2",
        position: "bottom",
        icon: <LeftOutlined/>,
        component: <Test/>
    },
    {
        key: "catalog",
        title: "catalog",
        position: "right",
        icon: <TableOutlined/>,
        component: <Test/>
    }
]

export const getToolbarMapByKey = toolbars.reduce((acc, toolbar) => {
    acc[toolbar.key] = toolbar;
    return acc;
}, {} as Record<string, Toolbar>);

export const getPositionToolbarsMap: () => Record<Toolbar['position'], Toolbar[]> = () => toolbars.reduce((acc, toolbar) => {
    const {position} = toolbar;
    if (!acc[position]) {
        acc[position] = [];
    }
    acc[position].push(toolbar);
    return acc;
}, {} as Record<string, Toolbar[]>);
