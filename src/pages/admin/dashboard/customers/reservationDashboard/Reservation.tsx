import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable, type DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import React, {useEffect, useRef, useState} from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import DialogReservationDashboard from "@/pages/admin/dashboard/components/DialogReservationDashboard.tsx";
import type {
    TApiPaginateResponse,
    TMetaData,
    TReservation,
    TTables,
} from "@/type/type.ts";
import {requestGet} from "@/api/api.ts";
import SearchInput from "@/pages/components/Search.tsx";
import {RESERVATION} from "@/api/url.ts";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import DatePickerFormatter from "@/pages/components/DatePicker/DatePickerFormatter.tsx";
import ActionUpdateStatus from "@/pages/admin/dashboard/customers/reservationDashboard/ActionUpdateStatus.tsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {statusReservation} from "@/constant";
import ChecklistIcon from '@mui/icons-material/Checklist';
import PendingIcon from '@mui/icons-material/Pending';
import BackspaceIcon from '@mui/icons-material/Backspace';
import BlockIcon from '@mui/icons-material/Block';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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

export const Reservation: React.FC = () => {
    const [modeDialog, setModeDialog] = React.useState<string>('');
    const [dataReservation, setDataReservation] = React.useState<TReservation>({} as TReservation);
    const [openDialog, setOpenDialog] = React.useState<boolean>(true);
    const [keyword, setKeyword] = useState("");
    const [dataTables, setDataTables] = useState<TMetaData<TReservation>>({} as TMetaData<TReservation>);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<string>('');

    const tableRef = useRef<DataTableRef>(null);

    const getDataReservation = () => {
        setLoading(true);
        const params = {
            keyword: keyword,
            date: dateFilter,
            page: tableRef.current?.getPage(),
            pageSize: tableRef.current?.getPageSize(),
        }
        requestGet<TApiPaginateResponse<TReservation>>(RESERVATION, params)
            .then((res) => {
                if (res.success) {
                    setDataTables(res.meta_data)
                }
            }).finally(() => {
            setLoading(false);
        })
    }
    const handleAddReservation = () => {
        setModeDialog('create');
        setDataReservation({} as TReservation);
        setOpenDialog(true);
    }

    const onActionClick = (mode: string, data: TReservation) => {
        setDataReservation(data);
        setModeDialog(mode);
        if (data && mode) {
            setOpenDialog(true);
        }
    }

    const handleRefresh = () => {
        tableRef.current?.refresh();
    };

    useEffect(() => {
        getDataReservation()
    }, [dateFilter]);

    const handleSearchEnter = () => {
        getDataReservation()
    }
    const getStatusGradient = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'linear-gradient(25deg, transparent 0%, hsl(39, 100%, 50%) 100%)'; // orange
            case 'confirmed':
                return 'linear-gradient(25deg, transparent 0%, rgba(0, 224, 11, 1) 100%)'; // green
            case 'canceled':
                return 'linear-gradient(25deg, transparent 0%, hsl(0, 80%, 50%) 100%)'; // red
            case 'rejected':
                return 'linear-gradient(25deg, transparent 0%, hsl(0, 80%, 50%) 100%)'; // red
            case 'completed':
                return 'linear-gradient(25deg, transparent 0%, hsl(210, 98%, 48%) 100%)'; // blue
            default:
                return 'linear-gradient(25deg, transparent 0%, #ccc 100%)'; // gray fallback
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <PendingIcon color="action" fontSize="large"/>;
            case 'confirmed':
                return <ChecklistIcon color="action" fontSize="large"/>;
            case 'canceled':
                return <BackspaceIcon color="action" fontSize="large"/>;
            case 'rejected':
                return <BlockIcon color="action" fontSize="large"/>;
            case 'completed':
                return <DoneAllIcon color="action" fontSize="large"/>;
            default:
                return null;
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
                    onRefresh={handleRefresh}
                />
            )}
            <Box sx={{display: 'flex', gap: 4, mb: 4, mt: 2}}>
                {
                    statusReservation.map((status) => (
                        <Card
                            sx={{
                                flex: 1,
                                minWidth: 240,
                                maxWidth: 400,
                                background: `${getStatusGradient(status)} !important`,
                                cursor: 'pointer',
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                    <Box>
                                        <Typography variant="h5" color="textSecondary" component="div">
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Typography>
                                        <Typography color="textSecondary" variant="h2">
                                            234
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        background: getStatusGradient(status),
                                        border: '1px solid', borderColor: 'divider', borderRadius: '50%', p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {getStatusIcon(status)}
                                    </Box>
                                </Box>
                                <Typography color="text.secondary" variant="subtitle1">
                                    Total Reservations {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                }

            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1}}>
                <Typography variant="h6" component="div">Reservation Page</Typography>
                <Box sx={{display: 'flex', justifyContent: 'end', gap: 2}}>
                    <IconButton
                        sx={{
                            width: 40,
                        }}
                        size="small"
                        onClick={handleAddReservation}
                    >
                        <AddIcon/>
                    </IconButton>
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <DatePickerFormatter size="small" label="Filter by date" value={dateFilter} onChange={(val) => setDateFilter(val)}/>
                    </Box>
                    <SearchInput
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onEnter={handleSearchEnter}
                    />
                </Box>
            </Box>

            <DataTable<TReservation>
                ref={tableRef}
                keyword={keyword}
                url={RESERVATION}
                columns={columns}
                data={dataTables}
                loading={loading}
                action
                onActionClick={onActionClick}/>
        </Box>
    );
}