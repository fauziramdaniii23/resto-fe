import {Navigate} from 'react-router-dom';
import {useAuthStore} from "@/store/useAuthStore.ts";

interface Props {
    children: React.ReactNode;
}

const Authorization = ({children}: Props) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/Home" replace />;
    }

    return <>{children}</>;
};

export default Authorization;
