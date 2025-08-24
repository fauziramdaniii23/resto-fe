import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";

export const BreadcrumbsMenus: MenusExtended[] = [
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
        label: 'Customers',
        icon: 'pinned',
        children: [
            {id: '2.1', label: 'Reservation', icon: 'reservation'},
            {id: '2.2', label: 'Orders', icon: 'orders'},
            {
                id: '2.3', label: 'Management Menus', icon: 'menus', route: '/Dashboard/Menus', children:
                    [
                        {id: '2.3.1', label: 'Detail Menu', icon: 'detail-menu'}
                    ]
            },
            {id: '2.4', label: 'Tables', icon: 'tables'},
        ],
    },
    {id: '3', label: 'Catatan Keuangan', icon: 'folder'},
    {id: '4', label: 'Pengelolaan', icon: 'trash'},
];