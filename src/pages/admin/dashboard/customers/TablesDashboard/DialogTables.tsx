import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {CircularProgress, InputAdornment} from "@mui/material";
import {requestDelete, requestGet, requestPost} from "@/api/api.ts";
import type {TApiResponse, TTables, Void} from "@/type/type.ts";
import {showToast} from "@/pages/util/toast.ts";
import {VIEW, EDIT, CREATE, DELETE, SUCCESS, ERROR} from "@/constant";
import Typography from "@mui/material/Typography";
import {TABLES} from "@/api/url.ts";


type DialogTablesProps = {
    mode: string;
    data: TTables;
    openDialog: boolean;
    onClose?: () => void;
    onRefresh?: () => void;
};

export default function DialogTables ({mode, data, openDialog, onClose, onRefresh}: DialogTablesProps) {

    const title: string = mode === CREATE ? 'Create Tables' : mode === VIEW ? 'View Tables' : mode === EDIT ? 'Edit Tables' : mode === 'delete' ? 'Delete Tables ?' : 'Create Tables';
    const [tableNumber, setTableNumber] = useState(data.table_number || '');
    const [capacity, setCapacity] = useState(data.capacity || '');
    const [errorCapacity, setErrorCapacity] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingGetTableNumber, setLoadingGetTableNumber] = useState(false);

    const handleClose = () => onClose?.();
    const handleRefresh = () => onRefresh?.();

    const validateForm = () => {
        let isValid = true;

        if (!capacity || capacity === '' || Number(capacity) <= 0) { setErrorCapacity(true); isValid = false; } else { setErrorCapacity(false); }

        return isValid;
    };

    const submitTables = () => {
        if (!validateForm()) {
            showToast(ERROR, 'Please fill all required fields');
            return;
        }
        setLoading(true)
        const payload = {
            id: data.id,
            table_number: tableNumber,
            capacity: capacity
        }
        requestPost<TApiResponse<Void>, typeof payload>(TABLES, payload)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, `${mode === CREATE ? 'Create' : 'Update'} Tables Success`);
                }
            }).finally(() => {
            setLoading(false);
            handleClose();
            handleRefresh()
        })
    }

    const deleteTable = () => {
        setLoading(true)
        const payload = {
            id: data.id,
        }
        requestDelete<TApiResponse<Void>>(`${TABLES}/delete`, payload)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, 'Delete Tables Success');
                }
            }).finally(() => {
            setLoading(false);
            handleClose();
            handleRefresh()
        })
    }

    const getTableNumber = () => {
        setLoadingGetTableNumber(true)
        requestGet<TApiResponse<{table_number: number}>>(`${TABLES}/generate-number`)
            .then((res) => {
                if (res.success) {
                    setTableNumber(res.data.table_number);
                }
            }).finally(() => {
            setLoadingGetTableNumber(false);
        })
    }

    useEffect(() => {
        if (mode === CREATE) {
            getTableNumber();
        } else {
            setTableNumber(data.table_number);
            setCapacity(data.capacity);
        }
    }, [data]);

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {
                        mode === 'delete' ? (
                            <Typography></Typography>
                        ) : (

                            <FormControl sx={{width: '100%'}} component="fieldset">
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                                    <TextField
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <>
                                                        {loadingGetTableNumber ? <CircularProgress size={20}/> : null}
                                                    </>
                                                ),
                                                startAdornment: <InputAdornment position="start">Table Number : </InputAdornment>,
                                            }
                                        }}
                                        value={tableNumber}
                                        disabled={true}
                                        label="Table Number"
                                        variant="outlined"/>

                                    <TextField
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">Capacity : </InputAdornment>,
                                            }
                                        }}
                                        type="number"
                                        error={errorCapacity}
                                        value={capacity}
                                        disabled={mode === 'view'}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        label="Capacity"
                                        variant="outlined"/>
                                </Box>
                            </FormControl>
                        )
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> {mode === VIEW ? 'Close' : 'Cancel'} </Button>
                    {
                        mode != 'view' && (
                            <>
                                <Button
                                    onClick={mode === DELETE ? deleteTable : submitTables}
                                    variant='contained'
                                    endIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SendIcon/>}
                                >
                                    {mode === EDIT ? 'Update' :
                                        mode === DELETE ? 'Delete' : 'Submit'}
                                </Button>
                            </>
                        )
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}