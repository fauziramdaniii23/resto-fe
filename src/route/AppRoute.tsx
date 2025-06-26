import {Routes, Route, Navigate} from 'react-router-dom';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import Home from '../pages/customer/Home';
import Authorization from "../pages/auth/Authorization.tsx";
import VerifyEmail from "../pages/components/VerifyEmail.tsx";
import ResetPassword from "../pages/components/ResetPassword.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";
import OAuth from "@/pages/auth/OAuth.tsx";
import Dashboard from "@/pages/admin/dashboard/Dashboard.tsx";
import SuperAdmin from "@/route/middleware/SuperAdmin.tsx";
import MiniDrawer from "@/pages/admin/dashboard/Dashboard2.tsx";

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
            <Route path="/Dashboard" element={<SuperAdmin><Dashboard/></SuperAdmin>}/>
            <Route path="/Dashboard2" element={<SuperAdmin><MiniDrawer/></SuperAdmin>}/>
        </Routes>
    );
};

export default AppRoutes;
