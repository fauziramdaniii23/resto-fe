import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type {TransitionProps} from '@mui/material/transitions';
import SendIcon from "@mui/icons-material/Send";
import DatePickerFormatter from "@/pages/components/DatePicker/DatePickerFormatter.tsx";
import TimePickerFormatter from "@/pages/components/DatePicker/TimePickerForrmatter.tsx";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {Autocomplete, CircularProgress} from "@mui/material";
import {requestGet, requestPost} from "@/api/api.ts";
import type {TApiResponse, Void} from "@/type/type.ts";
import {showToast} from "@/pages/util/toast.ts";
import type {TReservation} from "@/pages/admin/dashboard/customers/Reservation.tsx";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

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
};

export default function DialogReservationDashboard ({mode, data, openDialog, onClose}: DialogReservationDashboardProps) {
    const reservedDate = dayjs(data.reserved_at)
    const [date, setDate] = React.useState(reservedDate.format('YYYY-MM-DD'));
    const [time, setTime] = React.useState(reservedDate.format('HH:mm'));
    const [note, setNote] = React.useState(data.note);

    const [optionTables, setOptionTables] = useState<TTables[]>([]);
    const [selectedTable, setSelectedTable] = useState<TTables[]>(
        (data.tables ?? []).map(table => ({
            ...table,
            status: 'available'
        }))
    );

    const [loading, setLoading] = useState(false);

    const handleClose = () => onClose?.();

    const getDataTables = () => {
        setLoading(true);
        const params = {
            date: date,
            time: time,
        }
        requestGet<TApiResponse<TTables[]>>('/tables', params)
            .then((res) => {
                setOptionTables(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if(time && date && mode !== 'view') {
            getDataTables();
        }
    }, [date, time]);

    const handleChange = (_: unknown, newValue: TTables[]) => {
        setSelectedTable(newValue);
        console.log('Meja dipilih:', newValue);
    };

    const submitReservasi = () => {
        const payload = {
            user: data.user.id,
            date: date,
            time: time,
            tables: selectedTable,
            note: note,
        }
        requestPost<TApiResponse<Void>, typeof payload>('/reservation', payload)
            .then((res) => {
                console.log('Reservasi berhasil:', res);
                if (res.success) {
                    showToast('success', res.info? res.info : 'Reservation Success');
                } else {
                    showToast('error', 'Reservastion Failed');
                }
            }).finally(() => {
                handleClose();
                getDataTables()
        })
    }

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle>{"Reservation Now?"}</DialogTitle>
                <DialogContent>
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
                                getOptionLabel={(option) => `Meja ${option.table_number} (Kapasitas: ${option.capacity} orang)`}
                                getOptionDisabled={(option) => option.status !== 'available'}
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

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={submitReservasi}
                        endIcon={<SendIcon/>}
                    >Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}