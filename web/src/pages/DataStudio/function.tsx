import type {LayoutData} from "rc-dock";

export const getLayoutState = (layout: LayoutData, didInit: boolean): LayoutData => {
    if (didInit) {
        return layout;
    }
    let floatbox = layout?.floatbox;
    if (layout?.windowbox?.children) {
        if (floatbox) {
            layout.windowbox.children.forEach((item) => {
                layout.floatbox!!.children.push({...item});
            });
        } else {
            floatbox = layout.windowbox;
        }
    }
    return {
        ...layout,
        floatbox,
        windowbox: undefined
    };
};
