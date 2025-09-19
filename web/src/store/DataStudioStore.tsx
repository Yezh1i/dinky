import {create} from "zustand";
import type {Toolbar, ToolbarState} from "@/pages/DataStudio/type.ts";
import {getPositionToolbarsMap} from "@/pages/DataStudio/toolbar.tsx";


export interface IDataStudioStore {
    toolbar: ToolbarState,
    setToolbar: (position: Toolbar['position'], value: ToolbarState[Toolbar['position']]) => void
    setToolbarShow: (position: Toolbar['position'], open: ToolbarState[Toolbar['position']]['open']) => void
    setToolbarSize: (position: Toolbar['position'], value: number) => void
}

export const useDataStudioStore = create<IDataStudioStore>()((set): IDataStudioStore => ({
    toolbar: {
        left: {
            open: null,
            size:300,
            toolbars: getPositionToolbarsMap()['left'].map(item => item.key)
        },
        bottom: {
            open: null,
            size:300,
            toolbars: getPositionToolbarsMap()['bottom'].map(item => item.key)
        },
        right: {
            open: null,
            size:300,
            toolbars: getPositionToolbarsMap()['right'].map(item => item.key)
        },
    },
    setToolbar: (position, value) => {
        set((state) => ({
            toolbar: {
                ...state.toolbar,
                [position]: {
                    ...state.toolbar[position],
                    ...value
                }
            }
        }))
    },
    setToolbarShow: (position, open) => {
        set((state) => ({
            toolbar: {
                ...state.toolbar,
                [position]: {
                    ...state.toolbar[position],
                    open: open
                }
            }
        }))
    },
    setToolbarSize: (position, value) => {
        set((state) => ({
            toolbar: {
                ...state.toolbar,
                [position]: {
                    ...state.toolbar[position],
                    size: value
                }
            }
        }))
    }
}))
