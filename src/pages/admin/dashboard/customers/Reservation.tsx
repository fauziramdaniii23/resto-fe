import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable, type DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import type {TPropsSideNav} from "@/pages/admin/dashboard/components/MainContent.tsx";
import React, {useEffect, useRef, useState} from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import Chip from "@mui/material/Chip";
import DialogReservationDashboard from "@/pages/admin/dashboard/components/DialogReservationDashboard.tsx";
import type {TApiResponse, TUser, Void} from "@/type/type.ts";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from '@mui/material/Menu';
import {requestPost} from "@/api/api.ts";
import {showToast} from "@/pages/util/toast.ts";
import dayjs from "dayjs";
import {CircularProgress} from "@mui/material";

export type TTables = {
    id: number,
    table_number: number,
    capacity: number,
}

export type TReservation = {
    id: number,
    reserved_at: string,
    status: string,
    note: string,
    user: TUser,
    tables: TTables[],
    action: () => void;
}

const columns: Column<TReservation>[] = [
    {
        key: 'user',
        label: 'Name',
        format: (val) => val.name,
    },
    {
        key: 'reserved_at',
        label: 'Reservation Date',
        format: (val) => formatDate(val),
    },
    {
        key: 'tables.number',
        label: 'Table Number',
        align: 'center',
        format: (val: TTables[]) => val.map((t) => `${t.table_number}`).join(', '),
    },
    {
        key: 'tables.capacity',
        label: 'Amount Person',
        format: (val: TTables[]) => `${val.reduce((sum, t) => sum + t.capacity, 0)} person`,
    },
    {
        key: 'note',
        label: 'Note',
        maxWidth: 280
    },
    {
        key: 'status',
        label: 'Status',
        align: 'center',
        format: (_, row: TReservation) => <ActionUpdateStatus data={row}/>,
    }
]

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

    const statusReservation: string[] = ['confirmed', 'pending', 'canceled', 'completed'];

    const tableRef = useRef<DataTableRef>(null);
    const handleRefresh = () => {
        tableRef.current?.refresh();
    };
    const reservedDate = dayjs(data.reserved_at)
    const submitReservasi = (status: string) => {
        setLoading(true);
        handleClose();
        const payload = {
            id: data.id,
            date: reservedDate.format('YYYY-MM-DD'),
            time: reservedDate.format('HH:mm'),
            status: status,
            user_id: data.user.id,
            tables: data.tables,
            note: data.note,
        }
        requestPost<TApiResponse<Void>, typeof payload>('/reservation', payload)
            .then((res) => {
                if (res.success) {
                    showToast('success', 'Update Status Success');
                    data.status = status;
                } else {
                    showToast('error', 'Update Status Failed');
                }
            }).finally(() => {
            handleRefresh()
            setLoading(false);
        })
    }

    const val = data.status;
    return (
        <Box>
            <Button
                onClick={handleClick}
                disabled={val === 'completed'}
            >
                <Chip
                    color={
                        val === 'confirmed' ? 'success' :
                            val === 'pending' ? 'warning' :
                                val === 'canceled' ? 'error' : 'default'
                    }
                    label={val}/>
                <CircularProgress sx={{ml:2, display: loading ? 'block' : 'none'}} size={20} />
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
                            submitReservasi(status)
                        }}
                    >
                        <Chip
                            color={
                                status === 'confirmed' ? 'success' :
                                    status === 'pending' ? 'warning' :
                                        status === 'canceled' ? 'error' : 'default'
                            }
                            label={status}/>
                    </MenuItem>
                ))
            }
            </Menu>
        </Box>
    )
}

export const Reservation: React.FC<TPropsSideNav> = ({id}) => {
    const [modeDialog, setModeDialog] = React.useState<string>('');
    const [dataReservation, setDataReservation] = React.useState<TReservation>({} as TReservation);
    const [openDialog, setOpenDialog] = React.useState<boolean>(true);

    const onActionClick = (mode: string, data: TReservation) => {
        setDataReservation(data);
        setModeDialog(mode);
        if (data && mode) {
            setOpenDialog(true);
        }
    }
    const tableRef = useRef<DataTableRef>(null);
    const handleRefresh = () => {
        tableRef.current?.refresh();
    };
    useEffect(() => {
        handleRefresh()
    }, []);
    return (
        <Box>
            {openDialog && modeDialog && (
                <DialogReservationDashboard
                    mode={modeDialog}
                    data={dataReservation}
                    openDialog={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onRefresh={handleRefresh}
                />
            )}

            <Typography variant="h6" component="div">Reservation Page {id}</Typography>
            <DataTable<TReservation> ref={tableRef} url="/reservation" columns={columns} action
                                     onActionClick={onActionClick}/>
        </Box>
    );
}