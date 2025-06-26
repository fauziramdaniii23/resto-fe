import { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuthStore} from "../../store/useAuthStore.ts";

const Authorization = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const publicPaths = ['/SignIn', '/SignUp', '/email-verification', '/reset-password', '/PageNotFound', '/login-google'];

        console.log('currentPath', currentPath);

        if (!isAuthenticated && !publicPaths.includes(currentPath)) {
            navigate('/SignIn', { replace: true });
        }

        if (isAuthenticated) {
            navigate('/Home', { replace: true });
        }
    }, [isAuthenticated, navigate, location.pathname]);

    return null;
};

export default Authorization;
