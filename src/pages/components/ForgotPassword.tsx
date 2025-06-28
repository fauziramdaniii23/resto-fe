import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from "@mui/material/Box";
import Loader from "./Loader.tsx";
import {useState} from "react";
import {requestPost} from "@/api/api.ts";
import type {TApiResponse, Void} from "@/type/type.ts";
import {showToast} from "../util/toast.ts";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({open, handleClose}: ForgotPasswordProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const sumbitForgotPassword = () => {
        console.log('sumbitForgotPassword', email);
        setLoading(true);
        const payload = {
            email: email,
        }
        requestPost<TApiResponse<Void>, typeof payload>('/forgot-password', payload)
            .then((res) => {
                if(res.status === 200) {
                    showToast('success', 'Password reset link sent to your email.');
                }
            }).catch((err) => {
               const responseError = err.response?.data;
                showToast('error', responseError?.message || 'Failed to send password reset link.');
        })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <Box>
            <Loader show={loading}/>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            handleClose();
                        },
                        sx: {backgroundImage: 'none'},
                    },
                }}
            >
                <DialogTitle>Reset password</DialogTitle>
                <DialogContent
                    sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}
                >
                    <DialogContentText>
                        Enter your account&apos;s email address, and we&apos;ll send you a link to
                        reset your password.
                    </DialogContentText>
                    <OutlinedInput
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Email address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{pb: 3, px: 3}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={sumbitForgotPassword}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}