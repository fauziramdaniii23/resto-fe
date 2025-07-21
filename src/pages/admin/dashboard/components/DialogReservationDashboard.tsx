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
    const reservedDate = dayjs(data.reserved_at)
    const [date, setDate] = React.useState(reservedDate.format('YYYY-MM-DD'));
    const [time, setTime] = React.useState(reservedDate.format('HH:mm'));
    const [note, setNote] = React.useState(data.note);

    const title: string = mode === 'view' ? 'View Reservation' : mode === 'edit' ? 'Edit Reservation' : mode === 'delete' ? 'Delete Reservation ?' : 'Create Reservation';

    const mappingOptionsTables : TTables[] = data.tables.map((data) => ({
        id: data.id,
        table_number: data.table_number,
        capacity: data.capacity,
        status: 'available'
    }))
    console.log(data)

    const [optionTables, setOptionTables] = useState<TTables[]>([]);
    const [selectedTable, setSelectedTable] = useState<TTables[]>([]);

    const [loading, setLoading] = useState(false);

    const handleClose = () => onClose?.();
    const handleRefresh = () => onRefresh?.();

    const getDataTables = () => {
        setLoading(true);
        const params = {
            id_reservation: data.id,
            date: data.reserved_at
        }
        requestGet<TApiResponse<TTables[]>>('/tables', params)
            .then((res) => {
                const dataTables = res.data;
                const targetIds = mappingOptionsTables.map((table) => table.id);

                const updatedTables = dataTables.map(table =>
                    targetIds.includes(table.id)
                        ? { ...table, status: 'available' }
                        : table
                );

                const selectedFromData = data.tables
                    .map((mapped) => updatedTables.find((opt) => opt.id === mapped.id))
                    .filter(Boolean) as TTables[];

                setOptionTables(updatedTables);

                setSelectedTable(selectedFromData);
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
        if(time && date && mode === 'edit') {
            getDataTables();
        }
    }, [date, time]);

    const handleChange = (_: unknown, newValue: TTables[]) => {
        setSelectedTable(newValue);
        console.log('Meja dipilih:', newValue);
    };

    const submitReservation = () => {
        const payload = {
            id: data.id,
            date: date,
            time: time,
            status: data.status,
            user_id: data.user.id,
            tables: selectedTable,
            note: note,
        }
        requestPost<TApiResponse<Void>, typeof payload>(RESERVATION, payload)
            .then((res) => {
                console.log('Reservasi berhasil:', res);
                if (res.success) {
                    showToast('success', 'Update Reservation Success');
                } else {
                    showToast('error', 'Update Reservastion Failed');
                }
            }).finally(() => {
                handleClose();
                handleRefresh()
        })
    }

    const deleteReservation = () => {
        const payload = {
            id: data.id,
        }
        requestDelete<TApiResponse<Void>>('/reservation/delete', payload)
            .then((res) => {
                console.log('Reservasi berhasil dihapus:', res);
                if (res.success) {
                    showToast('success', 'Delete Reservation Success');
                } else {
                    showToast('error', 'Delete Reservastion Failed');
                }
            }).finally(() => {
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
                                        value={data.user.name}
                                        disabled
                                        label="Customer Name"
                                        variant="outlined" />
                                    <DatePickerFormatter
                                        disabled={mode === 'view'}
                                        value={date}
                                        onChange={(newValue) => setDate(newValue)}
                                        label="Reservasi Date"
                                        sx={{width: '100%'}}
                                    />
                                    <TimePickerFormatter
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
                                        getOptionLabel={(option) => `Meja ${option.table_number} (Kapasitas: ${option.capacity} orang)${option.status === 'booked' ? ' - (booked)' : ''}`}
                                        getOptionDisabled={(option) => option.status == 'booked'}
                                        noOptionsText="Please select a Reservation DateTime first"
                                        loading={loading}
                                        value={selectedTable}
                                        onChange={handleChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Pilih Meja"
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
                                </Box>
                            </FormControl>
                        )
                    }

                </DialogContent>
                <DialogActions>
                    {
                        mode != 'view' && (
                            <>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    variant='contained'
                                    onClick={mode === 'edit' ? submitReservation : deleteReservation}
                                    endIcon={<SendIcon/>}
                                >
                                    {mode === 'edit' ? 'Update' : 'Delete'}
                                </Button>
                            </>
                        )
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}