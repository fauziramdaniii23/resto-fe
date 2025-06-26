import { Navigate } from 'react-router-dom';
import {useAuthStore} from "@/store/useAuthStore.ts";
import {SUPER_ADMIN} from "@/constant";

interface Props {
    children: React.ReactNode;
}

const SuperAdmin = ({ children }: Props) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (user?.role !== SUPER_ADMIN) {
        return <Navigate to="/PageNotFound" replace />;
    }

    return <>{children}</>;
};

export default SuperAdmin;
