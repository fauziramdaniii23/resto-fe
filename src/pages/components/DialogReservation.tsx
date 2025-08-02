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
import type {TApiResponse, TReservation, TUser, Void} from "@/type/type.ts";
import {showToast} from "@/pages/util/toast.ts";
import dayjs from "dayjs";
import {VIEW, EDIT, CREATE, DELETE, SUCCESS, ERROR} from "@/constant";
import Typography from "@mui/material/Typography";
import {RESERVATION} from "@/api/url.ts";

export type TTables = {
    id: number,
    table_number: number,
    capacity: number,
    status: string;
}

type DialogReservationProps = {
    authUser?: TUser | null;
    mode: string;
    data: TReservation;
    openDialog: boolean;
    onClose?: () => void;
    onRefresh?: () => void;
};

export default function DialogReservation ({authUser ,mode, data, openDialog, onClose, onRefresh}: DialogReservationProps) {
    const [user, setUser] = useState<TUser>({} as TUser);
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [note, setNote] = React.useState('');
    const [customerName, setCustomerName] = useState('');
    const [remark, setRemark] = useState('');
    const [guestCount, setGuestCount] = useState('');

    const title: string = mode === CREATE ? 'Create Reservation' : mode === VIEW ? 'View Reservation' : mode === EDIT ? 'Edit Reservation' : mode === 'delete' ? 'Delete Reservation ?' : 'Create Reservation';
    let mappingOptionsTables: TTables[] = [];
    if (mode != CREATE) {
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
        requestGet<TApiResponse<TTables[]>>('/tables-available', params)
            .then((res) => {
                const dataTables = res.data;
                if (mode === CREATE) {
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
        if(authUser){
            setCustomerName(authUser.name);
        }
    }, []);

    useEffect(() => {
        if (time && date && mode !== VIEW) {
            getDataTables();
        }
    }, [date, time]);

    useEffect(() => {
        if (mode === CREATE) {
            setDate('');
            setTime('');
            setNote('');
            setGuestCount('');
            setSelectedTable([])
        }
        if(data && Object.keys(data).length > 0) {
            const reservedDate = dayjs(data.reserved_at)
            setDate(reservedDate.format('YYYY-MM-DD'));
            setTime(reservedDate.format('HH:mm'));
            setGuestCount(String(data.guest_count) || '');
            setCustomerName(data.customer_name || '');
            setSelectedTable(mappingOptionsTables)
            setNote(data.note || '');
            setRemark(data.remark || '');
        }
        setUser(authUser ? authUser : data.user);
    }, [data])

    const handleChange = (_: unknown, newValue: TTables[]) => {
        setSelectedTable(newValue);
    };
    const [errorCustomerName, setErrorCustomerName] = useState(false);
    const [errorGuestCount, setErrorGuestCount] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorTime, setErrorTime] = useState(false);
    const [errorTable, setErrorTable] = useState(false);

    const validateForm = () => {
        let isValid = true;

        if (!customerName || customerName.trim() === '') { setErrorCustomerName(true); isValid = false; } else { setErrorCustomerName(false); }
        if (!guestCount || guestCount.trim() === '' || Number(guestCount) <= 0) {setErrorGuestCount(true); isValid = false;} else {setErrorGuestCount(false);}
        if (!date || date.trim() === '') { setErrorDate(true); isValid = false; } else { setErrorDate(false); }
        if (!time || time.trim() === '') { setErrorTime(true); isValid = false; } else { setErrorTime(false); }
        if (selectedTable.length === 0) { setErrorTable(true); isValid = false; } else { setErrorTable(false); }

        return isValid;
    };

    useEffect(() => {
        if( errorCustomerName || errorGuestCount || errorDate || errorTime || errorTable) {
            validateForm()
        }
    }, [customerName, date, time, guestCount, selectedTable]);

    const submitReservation = () => {
        if (!validateForm()) {
            showToast(ERROR, 'Please fill all required fields');
            return;
        }
        setLoadSubmit(true)
        const payload = {
            id: data.id,
            customer_name: customerName,
            date: date,
            time: time,
            guest_count: parseInt(guestCount),
            status: data.status,
            user_id: user.id,
            tables: selectedTable,
            note: note,
            remark: remark
        }
        requestPost<TApiResponse<Void>, typeof payload>(RESERVATION, payload)
            .then((res) => {
                if (res.success) {
                    showToast(SUCCESS, `${mode === CREATE ? 'Create' : 'Update'} Reservation Success`);
                } else {
                    showToast(ERROR, 'Update Reservastion Failed');
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
                    showToast(SUCCESS, 'Delete Reservation Success');
                } else {
                    showToast(ERROR, 'Delete Reservastion Failed');
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
                                        disabled={authUser != null || mode != CREATE}
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
                                        shouldDisableDate={(date) =>
                                            date.isSame(dayjs(), 'day') || date.isBefore(dayjs(), 'day')
                                        }
                                    />
                                    <TimePickerFormatter
                                        error={errorTime}
                                        disabled={mode === 'view'}
                                        value={time}
                                        onChange={(newValue) => setTime(newValue)}
                                        label="Reservasi Time"
                                        sx={{width: '100%'}}
                                    />
                                    <TextField
                                        type="number"
                                        error={errorGuestCount}
                                        value={guestCount}
                                        disabled={mode === 'view'}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        label="Guest Count"
                                        variant="outlined"/>
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
                                        disabled={mode === VIEW}
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
                                            disabled={mode === VIEW}
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
                    <Button onClick={handleClose}> {mode === VIEW ? 'Close' : 'Cancel'} </Button>
                    {
                        mode != 'view' && (
                            <>
                                <Button
                                    onClick={mode === DELETE ? deleteReservation : submitReservation}
                                    variant='contained'
                                    endIcon={loadSubmit ? <CircularProgress size={20} color="inherit"/> : <SendIcon/>}
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