import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import Loader from "./Loader.tsx";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {showToast} from "../util/toast.ts";
import {requestPost} from "@/api/api.ts";
import type {TApiResponse} from "@/type/type.ts";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const payload = {
            token: token
        }

        if (token) {
            requestPost<TApiResponse<void>, typeof payload>('/verify-email', payload)
                .then((res) => {
                    showToast('success', res.info || 'Email berhasil diverifikasi');
                    navigate('/SignIn', {replace: true});
                }).catch(() => {
                toast.error('Verifikasi gagal');
            }).finally(() => {
                setShow(false);
            });
        } else {
            toast.error('Verifikasi email gagal');
            setShow(false);
            navigate('/SignIn', {replace: true});
        }
    }, [navigate]);

    return (
        <Box>
            <Loader fullScreen show={show}/>
        </Box>
    );
};

export default VerifyEmail;
