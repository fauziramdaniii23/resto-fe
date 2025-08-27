import { useNavigate } from "react-router-dom";
import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";

export const useRedirect = () => {
    const navigate = useNavigate();

     return (menu: MenusExtended) => {
        if (menu.route) {
            navigate(menu.route);
        } else {
            navigate("/PageNotFound");
        }
    };
};
