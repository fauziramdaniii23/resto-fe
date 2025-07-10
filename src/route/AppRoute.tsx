import {Routes, Route, Navigate} from 'react-router-dom';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import Home from '../pages/customer/Home';
import Authorization from "../pages/auth/Authorization.tsx";
import VerifyEmail from "../pages/components/VerifyEmail.tsx";
import ResetPassword from "../pages/components/ResetPassword.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import OAuth from "@/pages/auth/OAuth.tsx";
import SuperAdmin from "@/route/middleware/SuperAdmin.tsx";
import Dashboard from "@/pages/admin/dashboard/Dashboard.tsx";
import {DASHBOARD_HOME, DASHBOARD_RESERVATION} from "@/pages/admin/util/navigation.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/PageNotFound" replace />} />
            <Route path="/PageNotFound" element={<PageNotFound/>}/>
            <Route path="/" element={<Authorization/>}/>
            <Route path="/email-verification" element={<VerifyEmail/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/SignIn" element={<SignIn/>}/>
            <Route path="/SignUp" element={<SignUp/>}/>
            <Route path="/login-google" element={<OAuth/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Dashboard" element={<SuperAdmin><Dashboard id={DASHBOARD_HOME}/></SuperAdmin>}/>
            <Route path="/Dashboard/Reservation" element={<SuperAdmin><Dashboard id={DASHBOARD_RESERVATION}/></SuperAdmin>}/>
        </Routes>
    );
};

export default AppRoutes;
