import React, {useEffect, useRef, useState} from "react";
import type {TApiResponse, TReservation, Void} from "@/type/type.ts";
import type {DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import dayjs from "dayjs";
import {requestPost} from "@/api/api.ts";
import {showToast} from "@/pages/util/toast.ts";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import {statusReservation} from "@/constant";

const ActionUpdateStatus: React.FC<{ data: TReservation }> = ({data}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        handleRefresh()
        setAnchorEl(null);
    };
    const [loading, setLoading] = useState<boolean>(false);
    const [remark, setRemark] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [openRemark, setOpenRemark] = useState<boolean>(false);
    const [withRemark, setWithRemark] = useState<boolean>(false);

    const tableRef = useRef<DataTableRef>(null);
    const handleRefresh = () => {
        tableRef.current?.refresh();
    };
    const reservedDate = dayjs(data.reserved_at)
    const submitReservasi = (sendStatus?: string) => {
        setLoading(true);
        handleClose();
        const payload = {
            id: data.id,
            date: reservedDate.format('YYYY-MM-DD'),
            time: reservedDate.format('HH:mm'),
            status: sendStatus ? sendStatus : status,
            customer_name: data.customer_name,
            user_id: data.user?.id,
            tables: data.tables,
            note: data.note,
            remark: remark
        }
        requestPost<TApiResponse<Void>, typeof payload>('/reservation', payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', 'Update Status Success');
                    data.status = sendStatus ? sendStatus : status;
                } else {
                    showToast('error', 'Update Status Failed');
                }
            }).finally(() => {
            handleRefresh()
            setLoading(false);
        })
    }
    const handleClickStatus = (sendStatus: string) => {
        setStatus(sendStatus);
        if (sendStatus === 'canceled' || sendStatus === 'rejected') {
            setOpenRemark(true);
        } else {
            submitReservasi(sendStatus);
        }
    }
    const handleSubmitRemark = (remark: string) => {
        setRemark(remark);
        setWithRemark(true);
    }
    const val = data.status;

    useEffect(() => {
        if (withRemark) {
            setWithRemark(false);
            submitReservasi();
        }
    }, [withRemark]);

    return (
        <Box>
            <Button
                onClick={handleClick}
                disabled={val === 'completed'}
            >
                <Chip
                    color={
                        val === 'confirmed' ? 'success' :
                            val === 'completed' ? 'primary' :
                            val === 'pending' ? 'warning' :
                                val === 'canceled' ? 'error' :
                                    val === 'rejected' ? 'error' : 'default'
                    }
                    label={val}/>
                <CircularProgress sx={{ml: 2, display: loading ? 'block' : 'none'}} size={20}/>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >{
                statusReservation.map((status) => (
                    <MenuItem
                        key={status}
                        onClick={() => {
                            handleClickStatus(status)
                        }}
                    >
                        <Chip
                            color={
                                status === 'confirmed' ? 'success' :
                                    status === 'completed' ? 'primary' :
                                        status === 'pending' ? 'warning' :
                                            status === 'canceled' ? 'error' :
                                                status === 'rejected' ? 'error' : 'default'
                            }
                            label={status}/>
                    </MenuItem>
                ))
            }
            </Menu>
            <DialogRemark open={openRemark} onClose={() => setOpenRemark(false)}
                          onSubmit={(remark) => handleSubmitRemark(remark)}/>
        </Box>
    )
}

type DialogRemarkProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (remark: string) => void;
}

const DialogRemark = ({open, onClose, onSubmit}: DialogRemarkProps) => {
    const [remark, setRemark] = useState<string>('');
    const [errorRemark, setErrorRemark] = useState<boolean>(false);

    const handleSubmit = () => {
        if (remark.trim() === '') {
            setErrorRemark(true);
            return;
        }
        onSubmit(remark);
        setErrorRemark(false);
        setRemark('');
        onClose();
    }
    useEffect(() => {
        if (errorRemark) {
            setErrorRemark(false);
        }
    }, [remark])
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Remark</DialogTitle>
            <DialogContent>
                <TextField
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    label="remark"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    error={errorRemark}
                    sx={{width: 400, mt: 1}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}
                        variant='contained'
                        endIcon={<SendIcon/>}
                >Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ActionUpdateStatus;
