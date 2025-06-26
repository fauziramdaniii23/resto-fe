import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import {requestPost} from "../../api/api.ts";
import type {TApiResponse, Void} from "../../type/type.ts";
import {showToast} from "../util/toast.ts";
import {useState} from "react";

interface DialogVerifyEmailProps {
    open: boolean;
    onClose: () => void;
    userData?: userData;
}

interface userData {
    email: string;
    password: string;
}

const DialogVerifyEmail = ({open, onClose, userData}: DialogVerifyEmailProps) => {
    const [loading, setLoading] = useState(false);
    const [retryVerify, setRetryVerify] = useState(false);
    const onClickVerifyEmail = () => {
        setLoading(true);
        const payload = {
            email: userData?.email,
            password: userData?.password
        }
        requestPost<TApiResponse<Void>, typeof payload>('/verify-email-notification', payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', 'Verify was send in your email, Please Check your email!');
                }
            }).finally(()=>{
                setLoading(false);
                setRetryVerify(true);
        })
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Email Belum Diverifikasi"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Silakan verifikasi email Anda untuk melanjutkan. Cek kotak masuk email Anda dan klik tautan
                    verifikasi yang telah kami kirimkan. Jika Anda tidak menerima email, periksa folder spam atau minta
                    pengiriman ulang.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onClickVerifyEmail}
                    autoFocus
                    endIcon={<SendIcon/>}
                    loading={loading}
                    loadingPosition="end"
                >
                    {retryVerify ? 'Kirim Ulang Verify Email' : 'Verify Email'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogVerifyEmail;

