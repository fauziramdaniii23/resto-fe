export type MenusExtended = {
    id: string;
    label: string;
    icon?: string;
    children?: MenusExtended[];
};

export const Menus: MenusExtended[] = [
    {
        id: '1',
        label: 'Dashboard',
        children: [
            {id: '1.1', label: 'Company', icon: 'home'},
            {id: '1.2', label: 'Personal', icon: 'folder'},
            {id: '1.3', label: 'Group photo', icon: 'image'},
        ],
    },
    {
        id: '2',
        label: 'Management User',
        icon: 'pinned',
        children: [
            {id: '2.1', label: 'Learning materials', icon: 'folder'},
            {id: '2.2', label: 'News', icon: 'folder'},
            {id: '2.3', label: 'Forums', icon: 'folder'},
            {id: '2.4', label: 'Travel documents', icon: 'pdf'},
        ],
    },
    {id: '3', label: 'Catatan Keuangan', icon: 'folder'},
    {id: '4', label: 'Pengelolaan', icon: 'trash'},
];

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
    if( !id) return undefined;
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

