import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable} from "@/pages/components/DataTable/Table.tsx";
import type {TPropsSideNav} from "@/pages/admin/dashboard/components/MainContent.tsx";
import React from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import Chip from "@mui/material/Chip";
import DialogReservationDashboard from "@/pages/admin/dashboard/components/DialogReservationDashboard.tsx";
import type {TUser} from "@/type/type.ts";

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
        key: 'name',
        label: 'Name',
    },
    {
        key: 'reserved_at',
        label: 'Reservation Date',
        format: (val) => formatDate(val),
    },
    {
        key: 'table_number',
        label: 'Table',
        align: 'center',
    },
    {
        key: 'capacity',
        label: 'Capacity',
        format: (val) => `${val} people`,
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
        format: (val) =>
            <Chip
                color={
                    val === 'confirmed' ? 'success' :
                    val === 'pending' ? 'warning' :
                    val === 'cancelled' ? 'error' : 'default'
                }
                label={val}/>

    }
]

export const Reservation: React.FC<TPropsSideNav>  = ({id}) => {
    const [modeDialog, setModeDialog] = React.useState<string>('');
    const [dataReservation, setDataReservation] = React.useState<TReservation>({} as TReservation);
    const [openDialog, setOpenDialog] = React.useState<boolean>(true);
    const onActionClick = (mode: string, data: TReservation) => {
        setDataReservation(data);
        setModeDialog(mode);
        if(data && mode){
            setOpenDialog(true);
        }
    }
    return (
        <Box>
            {openDialog && modeDialog && (
                <DialogReservationDashboard
                    mode={modeDialog}
                    data={dataReservation}
                    openDialog={openDialog}
                    onClose={() => setOpenDialog(false)}
                />
            )}

            <Typography variant="h6" component="div">Reservation Page {id}</Typography>
            <DataTable <TReservation> url="/reservation" columns={columns} action onActionClick={onActionClick}/>
        </Box>
    );
}