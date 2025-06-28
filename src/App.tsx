import AppRoutes from "./route/AppRoute.tsx";
import Toast from "./pages/components/Toast.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {setNavigate} from "./pages/util/navigation.tsx";
import {useAuthStore} from "./store/useAuthStore.ts";
import {injectLogoutHandler} from "./api/api.ts";

function App() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    useEffect(() => {
        injectLogoutHandler(logout)
    }, [logout]);
    return (
        <div style={{ width: '100%', padding: 0, margin: 0 }}>
            <AppRoutes />
            <Toast/>
        </div>
    );
}

export default App
