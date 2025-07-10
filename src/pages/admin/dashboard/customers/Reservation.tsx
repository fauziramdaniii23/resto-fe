import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable} from "@/pages/components/DataTable/Table.tsx";
import type {TPropsSideNav} from "@/pages/admin/dashboard/components/MainContent.tsx";
import React from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";

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
        key: 'status',
        label: 'Status',
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
];

export const Reservation: React.FC<TPropsSideNav>  = ({id, openSideNav}) => {
    return (
        <Box
            sx={{
                width: openSideNav ? `calc(100% - ${20}px)` : '100%',
            }}
        >
            <Typography variant="h6" component="div">Reservation Page {id}</Typography>
            <DataTable <TReservation> url="/reservation" columns={columns}/>
        </Box>
    );
}