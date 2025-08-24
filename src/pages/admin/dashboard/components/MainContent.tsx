import {MainDashboard} from "@/pages/admin/dashboard/Main.tsx";
import {Reservation} from "@/pages/admin/dashboard/customers/reservationDashboard/Reservation.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import {Tables} from "@/pages/admin/dashboard/customers/TablesDashboard/Tables.tsx";
import {Menus} from "@/pages/admin/dashboard/customers/menusDashboard/Menus.tsx";
import {Orders} from "@/pages/admin/dashboard/customers/ordersDashboard/Orders.tsx";
import {useMenuStore} from "@/store/useMenuStore.ts";
import {DetailMenus} from "@/pages/admin/dashboard/customers/menusDashboard/DetailMenus.tsx";

const MapMainComponent: Record<string, React.ComponentType>= {
    '1.1': MainDashboard,
    '2.1': Reservation,
    '2.2': Orders,
    '2.3': Menus,
    '2.3.1': DetailMenus,
    '2.4': Tables
}

export const MainContent = () => {
    const menu = useMenuStore((state) => state);
    const Component = MapMainComponent[menu.id || ''];

    if (!Component) {
        return (
            <PageNotFound/>
        )
    }

    return <Component/>;
}