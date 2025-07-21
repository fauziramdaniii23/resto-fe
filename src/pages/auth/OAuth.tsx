import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import Loader from "@/pages/components/Loader.tsx";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {showToast} from "@/pages/util/toast.ts";

type user = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
}

const OAuth = () => {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');

        if (tokenParam) {
            axios.get(baseUrl + '/user', {
                headers: {
                    Authorization: `Bearer ${tokenParam}`
                }
            }).then((response) => {
                const res = response.data;
                const user: user = res.data as user;

                useAuthStore.getState().login({
                    token: tokenParam,
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                });
                navigate('/Home', {replace: true});
            }).catch((error) => {
                showToast('error', 'Login Failed, ' + error.message);
            })
        } else {
            navigate('/SignIn');
            showToast('error', 'Login Failed');
        }
    }, []);

    return (
        <Loader show={true}/>
    )
};

export default OAuth;
