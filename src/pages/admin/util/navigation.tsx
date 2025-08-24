export const DASHBOARD_HOME = '1.1';
export const DASHBOARD_RESERVATION = '2.1';
export const DASHBOARD_ORDERS = '2.2';
export const DASHBOARD_MENUS = '2.3';
export const DASHBOARD_TABLES = '2.4';

export type MenusExtended = {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    children?: MenusExtended[];
};

export function getMenuById(
    menus: MenusExtended[],
    id: string
): MenusExtended | undefined {
    for (const menu of menus) {
        if (menu.id === id) return menu;
        if (menu.children) {
            const found = getMenuById(menu.children, id);
            if (found) return found;
        }
    }
    return undefined;
}

export function getBreadcrumbPath(
    menus: MenusExtended[],
    id?: string,
    path: MenusExtended[] = []
): MenusExtended[] | undefined {
    if (!id) return undefined;
    for (const menu of menus) {
        const newPath = [...path, menu];

        if (menu.id === id) {
            return newPath;
        }
        if (menu.children) {
            const found = getBreadcrumbPath(menu.children, id, newPath);
            if (found) return found;
        }
    }
    return undefined;
}

