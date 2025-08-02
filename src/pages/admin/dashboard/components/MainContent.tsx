import {MainDashboard} from "@/pages/admin/dashboard/Main.tsx";
import {Reservation} from "@/pages/admin/dashboard/customers/reservationDashboard/Reservation.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import {Tables} from "@/pages/admin/dashboard/customers/TablesDashboard/Tables.tsx";

export type TPropsSideNav = {
    id: string;
    openSideNav: boolean;
}

const MapMainComponent: Record<string, React.ComponentType<TPropsSideNav>> = {
    '1.1': MainDashboard,
    '2.1': Reservation,
    '2.4': Tables
}

export const MainContent = ({ id, openSideNav }: TPropsSideNav) => {
    const Component = MapMainComponent[id];

    if (!Component) {
        return (
            <PageNotFound/>
        )
    }

    return <Component id={id} openSideNav={openSideNav}/>;
}