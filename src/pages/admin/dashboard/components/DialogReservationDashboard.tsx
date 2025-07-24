import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from "@mui/icons-material/Send";
import DatePickerFormatter from "@/pages/components/DatePicker/DatePickerFormatter.tsx";
import TimePickerFormatter from "@/pages/components/DatePicker/TimePickerForrmatter.tsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {Autocomplete, CircularProgress} from "@mui/material";
import {requestDelete, requestGet, requestPost} from "@/api/api.ts";
import type {TApiResponse, TReservation, Void} from "@/type/type.ts";
import {showToast} from "@/pages/util/toast.ts";
import dayjs from "dayjs";
import {VIEW} from "@/constant";
import Typography from "@mui/material/Typography";
import {RESERVATION} from "@/api/url.ts";

export type TTables = {
    id: number,
    table_number: number,
    capacity: number,
    status: string;
}

type DialogReservationDashboardProps = {
    mode: string;
    data: TReservation;
    openDialog: boolean;
    onClose?: () => void;
    onRefresh?: () => void;
};

export default function DialogReservationDashboard ({mode, data, openDialog, onClose, onRefresh}: DialogReservationDashboardProps) {

    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [note, setNote] = React.useState(data.note);
    const [customerName, setCustomerName] = useState(data.customer_name);
    const [remark, setRemark] = useState(data.remark || '');

    const title: string = mode === 'create' ? 'Create Reservation' : mode === 'view' ? 'View Reservation' : mode === 'edit' ? 'Edit Reservation' : mode === 'delete' ? 'Delete Reservation ?' : 'Create Reservation';
    let mappingOptionsTables: TTables[] = [];
    if (mode != 'create') {
        mappingOptionsTables = data.tables.map((data) => ({
            id: data.id,
            table_number: data.table_number,
            capacity: data.capacity,
            status: 'available'
        }))
    }

    const [optionTables, setOptionTables] = useState<TTables[]>([]);
    const [selectedTable, setSelectedTable] = useState<TTables[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    const handleClose = () => onClose?.();
    const handleRefresh = () => onRefresh?.();

    const getDataTables = () => {
        setLoading(true);
        const params = {
            id_reservation: data.id,
            date: `${date} ${time}`
        }
        requestGet<TApiResponse<TTables[]>>('/tables', params)
            .then((res) => {
                const dataTables = res.data;
                if (mode === 'create') {
                    setOptionTables(dataTables);
                } else {
                    const targetIds = mappingOptionsTables.map((table) => table.id);

                    const updatedTables = dataTables.map(table =>
                        targetIds.includes(table.id)
                            ? {...table, status: 'available'}
                            : table
                    );

                    const selectedFromData = data.tables
                        .map((mapped) => updatedTables.find((opt) => opt.id === mapped.id))
                        .filter(Boolean) as TTables[];

                    setOptionTables(updatedTables);

                    setSelectedTable(selectedFromData);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        if (mode === VIEW) {
            setSelectedTable(mappingOptionsTables)
        }
    }, []);

    useEffect(() => {
        if (time && date && mode !== VIEW) {
            getDataTables();
        }
    }, [date, time]);

    useEffect(() => {
        if (mode === 'create') {
            setDate('');
            setTime('');
            setNote('');
        }
        if(data.reserved_at){
            const reservedDate = dayjs(data.reserved_at)
            setDate(reservedDate.format('YYYY-MM-DD'));
            setTime(reservedDate.format('HH:mm'));
        }
    }, [])

    const handleChange = (_: unknown, newValue: TTables[]) => {
        setSelectedTable(newValue);
    };
    const [errorCustomerName, setErrorCustomerName] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorTime, setErrorTime] = useState(false);
    const [errorTable, setErrorTable] = useState(false);

    const validateForm = () => {
        let isValid = true;

        if (!customerName || customerName.trim() === '') { setErrorCustomerName(true); isValid = false; } else { setErrorCustomerName(false); }
        if (!date || date.trim() === '') { setErrorDate(true); isValid = false; } else { setErrorDate(false); }
        if (!time || time.trim() === '') { setErrorTime(true); isValid = false; } else { setErrorTime(false); }
        if (selectedTable.length === 0) { setErrorTable(true); isValid = false; } else { setErrorTable(false); }

        return isValid;
    };

    const submitReservation = () => {
        if (!validateForm()) {
            showToast('error', 'Please fill all required fields');
            return;
        }
        setLoadSubmit(true)
        const payload = {
            id: data.id,
            customer_name: customerName,
            date: date,
            time: time,
            status: data.status,
            user_id: data.user?.id,
            tables: selectedTable,
            note: note,
            remark: remark
        }
        requestPost<TApiResponse<Void>, typeof payload>(RESERVATION, payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', 'Update Reservation Success');
                } else {
                    showToast('error', 'Update Reservastion Failed');
                }
            }).finally(() => {
                setLoadSubmit(false);
                handleClose();
                handleRefresh()
        })
    }

    const deleteReservation = () => {
        setLoadSubmit(true)
        const payload = {
            id: data.id,
        }
        requestDelete<TApiResponse<Void>>('/reservation/delete', payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', 'Delete Reservation Success');
                } else {
                    showToast('error', 'Delete Reservastion Failed');
                }
            }).finally(() => {
            setLoadSubmit(false);
            handleClose();
            handleRefresh()
        })
    }

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
                                        error={errorCustomerName}
                                        value={customerName}
                                        disabled={mode != 'create'}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        label="Customer Name"
                                        variant="outlined"/>
                                    <DatePickerFormatter
                                        error={errorDate}
                                        disabled={mode === 'view'}
                                        value={date}
                                        onChange={(newValue) => setDate(newValue)}
                                        label="Reservasi Date"
                                        sx={{width: '100%'}}
                                    />
                                    <TimePickerFormatter
                                        error={errorTime}
                                        disabled={mode === 'view'}
                                        value={time}
                                        onChange={(newValue) => setTime(newValue)}
                                        label="Reservasi Time"
                                        sx={{width: '100%'}}
                                    />
                                    <Autocomplete
                                        disabled={mode === 'view'}
                                        multiple
                                        options={optionTables}
                                        getOptionLabel={(option) => `Table ${option.table_number} (Capacity: ${option.capacity} person)${option.status === 'booked' ? ' - (booked)' : ''}`}
                                        getOptionDisabled={(option) => option.status == 'booked'}
                                        noOptionsText="Please select a Reservation DateTime first"
                                        loading={loading}
                                        value={selectedTable}
                                        onChange={handleChange}
                                        renderInput={(params) => (
                                            <TextField
                                                error={errorTable}
                                                {...params}
                                                label="select a table"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loading ? <CircularProgress size={20}/> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    <TextField
                                        disabled={mode === 'view'}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        label="Note"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    {(data.status === 'canceled' || data.status === 'rejected') && (
                                        <TextField
                                            disabled={mode === 'view'}
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            label="Remark"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}

                                </Box>
                            </FormControl>
                        )
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> {mode === 'view' ? 'Close' : 'Cancel'} </Button>
                    {
                        mode != 'view' && (
                            <>
                                <Button
                                    onClick={mode === 'delete' ? deleteReservation : submitReservation}
                                    variant='contained'
                                    endIcon={loadSubmit ? <CircularProgress size={20} color="inherit"/> : <SendIcon/>}
                                >
                                    {mode === 'edit' ? 'Update' :
                                        mode === 'delete' ? 'Delete' : 'Submit'}
                                </Button>
                            </>
                        )
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}