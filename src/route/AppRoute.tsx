import {Routes, Route, Navigate} from 'react-router-dom';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import Authorization from "./middleware/Authorization.tsx";
import VerifyEmail from "../pages/components/VerifyEmail.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import OAuth from "@/pages/auth/OAuth.tsx";
import SuperAdmin from "@/route/middleware/SuperAdmin.tsx";
import Dashboard from "@/pages/admin/dashboard/Dashboard.tsx";
import CustomerPages from "@/pages/customer/Customer.tsx";
import {HOME, ORDERS} from "@/pages/customer/type/CustomerNavigation.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/PageNotFound" replace />} />
            <Route path="/PageNotFound" element={<PageNotFound/>}/>
            <Route path="/" element={<CustomerPages menu={HOME}/>}/>
            <Route path="/email-verification" element={<VerifyEmail/>}/>
            <Route path="/reset-password" element={<Authorization><ResetPassword/></Authorization>}/>
            <Route path="/SignIn" element={<Authorization><SignIn/></Authorization>}/>
            <Route path="/SignUp" element={<Authorization><SignUp/></Authorization>}/>
            <Route path="/login-google" element={<OAuth/>}/>

            //customer routes
            <Route path="/Home" element={<CustomerPages menu={HOME}/>}/>
            <Route path="/Orders" element={<CustomerPages menu={ORDERS}/>}/>

            //administrator routes
            <Route path="/Dashboard" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard/Reservation" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard/Orders" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard/Menus" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard/Menus/DetailMenu" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard/Tables" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
        </Routes>
    );
};

export default AppRoutes;
