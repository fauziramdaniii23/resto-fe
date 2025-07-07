import {MainDashboard} from "@/pages/admin/dashboard/Main.tsx";
import {Reservation} from "@/pages/admin/dashboard/customers/Reservation.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";

interface Props {
    id: string;
}

const MapMainComponent: Record<string, React.ComponentType<Props>> = {
    '1.1': MainDashboard,
    '2.1': Reservation
}

export const MainContent = ({ id }: Props) => {
    const Component = MapMainComponent[id];

    if (!Component) {
        return (
            <PageNotFound/>
        )
    }

    return <Component id={id}/>;

}