import {MainDashboard} from "@/pages/admin/dashboard/Main.tsx";
import {Reservation} from "@/pages/admin/dashboard/customers/Reservation.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";

export type TPropsSideNav = {
    id: string;
    openSideNav: boolean;
}

const MapMainComponent: Record<string, React.ComponentType<TPropsSideNav>> = {
    '1.1': MainDashboard,
    '2.1': Reservation
}

export const MainContent = ({ id, openSideNav }: TPropsSideNav) => {
    const Component = MapMainComponent[id];
    console.log(openSideNav)

    if (!Component) {
        return (
            <PageNotFound/>
        )
    }

    return <Component id={id} openSideNav={openSideNav}/>;
}