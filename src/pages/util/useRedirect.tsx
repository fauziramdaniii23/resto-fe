import { useNavigate } from "react-router-dom";
import {useMenuStore} from "@/store/useMenuStore.ts";
import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";

export const useRedirect = () => {
    const navigate = useNavigate();
    const menuState = useMenuStore((state) => state);

     return (menu: MenusExtended, data?: unknown) => {
        if (menu.route) {
            menuState.setMenu(menu.id, menu.label, data);
            navigate(menu.route);
        } else {
            navigate("/PageNotFound");
        }
    };
};
