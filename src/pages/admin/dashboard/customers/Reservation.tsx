import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable} from "@/pages/components/DataTable/Table.tsx";
import type {TPropsSideNav} from "@/pages/admin/dashboard/components/MainContent.tsx";
import React from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import Chip from "@mui/material/Chip";

type TReservation = {
    id: number,
    reserved_at: string,
    status: string,
    table_id: number,
    note: string,
    user_id: number;
    name: string;
    table_number: number,
    capacity: number,
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
const onActionClick = (mode: string, data: TReservation) => {
    console.log(`Action: ${mode} on reservation: ${data.note}`);
}
export const Reservation: React.FC<TPropsSideNav>  = ({id}) => {
    return (
        <Box>
            <Typography variant="h6" component="div">Reservation Page {id}</Typography>
            <DataTable <TReservation> url="/reservation" columns={columns} action onActionClick={onActionClick}/>
        </Box>
    );
}