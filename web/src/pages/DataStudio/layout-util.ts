// 验证main group的panel位置约束
import type {LayoutBase} from "rc-dock/src/DockData";

export function validateMainPanelConstraints(layout: LayoutBase): boolean {
    // 递归查找所有panel
    function findAllPanels(box: any): any[] {
        const panels: any[] = [];

        if (box.tabs) {
            // 这是一个panel
            panels.push(box);
        } else if (box.children) {
            // 这是一个box，递归查找
            for (const child of box.children) {
                panels.push(...findAllPanels(child));
            }
        }

        return panels;
    }

    // 检查panel是否在合法位置
    function isValidMainPanelPosition(panel: any): boolean {
        // 只检查main group的panel
        if (panel.group !== 'main') {
            return true;
        }

        // 获取panel在布局中的位置信息
        const position = getPanelPosition(panel, layout.dockbox);

        if (!position) {
            return false; // panel不在dockbox中
        }

        // 检查各种约束条件
        return (
            !isAtEdge(position) &&
            !isConflictWithToolbar(position, layout) &&
            isInCenterArea(position, layout)
        );
    }

    // 获取panel在布局树中的位置
    function getPanelPosition(targetPanel: any, root: any, path: number[] = []): any {
        if (root === targetPanel) {
            return { panel: targetPanel, path, parent: null };
        }

        if (root.children) {
            for (let i = 0; i < root.children.length; i++) {
                const child = root.children[i];
                const result = getPanelPosition(targetPanel, child, [...path, i]);
                if (result) {
                    if (result.panel === targetPanel && !result.parent) {
                        result.parent = root;
                    }
                    return result;
                }
            }
        }

        return null;
    }

    // 检查是否在边缘位置
    function isAtEdge(position: any): boolean {
        const { path, parent } = position;

        if (!parent || !parent.children) {
            return false;
        }

        // 检查是否在第一层的最左边或最右边
        if (path.length === 1) {
            const index = path[0];
            const siblingCount = parent.children.length;

            // 不能在最左边(index 0)或最右边(最后一个index)
            if (index === 0 || index === siblingCount - 1) {
                return true;
            }
        }

        return false;
    }

    // 检查是否与toolbar冲突
    function isConflictWithToolbar(position: any, layout: LayoutBase): boolean {
        const allPanels = findAllPanels(layout.dockbox);

        // 查找各种toolbar
        const toolbarLeft = allPanels.find(p => p.group === 'toolbar-left');
        const toolbarRight = allPanels.find(p => p.group === 'toolbar-right');
        const toolbarBottom = allPanels.find(p => p.group === 'toolbar-bottom');

        // 检查相对位置关系
        if (toolbarLeft && isLeftOfToolbar(position, toolbarLeft, layout)) {
            return true;
        }

        if (toolbarRight && isRightOfToolbar(position, toolbarRight, layout)) {
            return true;
        }

        if (toolbarBottom && isBelowToolbar(position, toolbarBottom, layout)) {
            return true;
        }

        return false;
    }

    // 检查是否在toolbar-left的左边
    function isLeftOfToolbar(mainPosition: any, toolbarPanel: any, layout: LayoutBase): boolean {
        const toolbarPosition = getPanelPosition(toolbarPanel, layout.dockbox);
        if (!toolbarPosition) return false;

        return isRelativelyLeft(mainPosition, toolbarPosition);
    }

    // 检查是否在toolbar-right的右边
    function isRightOfToolbar(mainPosition: any, toolbarPanel: any, layout: LayoutBase): boolean {
        const toolbarPosition = getPanelPosition(toolbarPanel, layout.dockbox);
        if (!toolbarPosition) return false;

        return isRelativelyRight(mainPosition, toolbarPosition);
    }

    // 检查是否在toolbar-bottom的下面
    function isBelowToolbar(mainPosition: any, toolbarPanel: any, layout: LayoutBase): boolean {
        const toolbarPosition = getPanelPosition(toolbarPanel, layout.dockbox);
        if (!toolbarPosition) return false;

        return isRelativelyBelow(mainPosition, toolbarPosition);
    }

    // 判断相对位置关系的辅助函数
    function isRelativelyLeft(pos1: any, pos2: any): boolean {
        const commonParent = findCommonParent(pos1, pos2);
        if (!commonParent || commonParent.mode !== 'horizontal') {
            return false;
        }

        const index1 = getDirectChildIndex(commonParent, pos1.panel);
        const index2 = getDirectChildIndex(commonParent, pos2.panel);

        return index1 !== -1 && index2 !== -1 && index1 < index2;
    }

    function isRelativelyRight(pos1: any, pos2: any): boolean {
        const commonParent = findCommonParent(pos1, pos2);
        if (!commonParent || commonParent.mode !== 'horizontal') {
            return false;
        }

        const index1 = getDirectChildIndex(commonParent, pos1.panel);
        const index2 = getDirectChildIndex(commonParent, pos2.panel);

        return index1 !== -1 && index2 !== -1 && index1 > index2;
    }

    function isRelativelyBelow(pos1: any, pos2: any): boolean {
        const commonParent = findCommonParent(pos1, pos2);
        if (!commonParent || commonParent.mode !== 'vertical') {
            return false;
        }

        const index1 = getDirectChildIndex(commonParent, pos1.panel);
        const index2 = getDirectChildIndex(commonParent, pos2.panel);

        return index1 !== -1 && index2 !== -1 && index1 > index2;
    }

    // 查找共同父容器
    function findCommonParent(pos1: any, pos2: any): any {
        const getAncestors = (position: any): any[] => {
            const ancestors: any[] = [];
            let current = position.parent;

            while (current) {
                ancestors.push(current);
                // 向上查找父级
                const parentPos = getPanelPosition(current, layout.dockbox);
                current = parentPos?.parent;
            }

            return ancestors;
        };

        const ancestors1 = getAncestors(pos1);
        const ancestors2 = getAncestors(pos2);

        // 找到第一个共同的祖先
        for (const ancestor1 of ancestors1) {
            if (ancestors2.includes(ancestor1)) {
                return ancestor1;
            }
        }

        return layout.dockbox; // 默认返回根容器
    }

    // 获取直接子元素的索引
    function getDirectChildIndex(parent: any, targetPanel: any): number {
        if (!parent.children) return -1;

        // 查找targetPanel或其祖先在parent.children中的位置
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            if (child === targetPanel || isAncestorOf(child, targetPanel)) {
                return i;
            }
        }

        return -1;
    }

    // 检查ancestor是否是target的祖先
    function isAncestorOf(ancestor: any, target: any): boolean {
        if (ancestor === target) return true;

        if (ancestor.children) {
            for (const child of ancestor.children) {
                if (isAncestorOf(child, target)) {
                    return true;
                }
            }
        }

        return false;
    }

    // 检查是否在中心区域（避免在浮动区域等）
    function isInCenterArea(position: any, layout: LayoutBase): boolean {
        // 确保panel在dockbox中，而不是在floatbox、windowbox或maxbox中
        let current = position.panel;

        while (current && current.parent) {
            current = current.parent;
        }

        // 最终应该到达dockbox根节点
        return current === layout.dockbox;
    }

    // 执行验证
    const allPanels = findAllPanels(layout.dockbox || {});

    for (const panel of allPanels) {
        if (!isValidMainPanelPosition(panel)) {
            console.warn(`Main panel "${panel.id}" violates position constraints`);
            return false;
        }
    }

    return true;
}
