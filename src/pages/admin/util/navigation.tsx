export type ExtendedTreeItemProps = {
    icon?: string;
    id: string;
    label: string;
    children?: ExtendedTreeItemProps[];
};

export const Menus: ExtendedTreeItemProps[] = [
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
