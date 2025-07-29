import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {type Column, DataTable, type DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import React, { useRef, useState} from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import DialogReservation from "@/pages/components/DialogReservation.tsx";
import type {
    TApiPaginateResponse, TApiResponse,
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
import ChecklistIcon from '@mui/icons-material/Checklist';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import {statusReservation} from "@/constant";

const columns: Column<TReservation>[] = [
    {
        key: 'customer_name',
        label: 'Name',
    },
    {
        key: 'reserved_at',
        label: 'Reservation Date',
        format: (val) => formatDate(val),
    },
    {
        key: 'updated_at',
        label: 'Updated Date',
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

type TStatusReservation = {
    status: string;
    total: number;
};

export const Reservation: React.FC = () => {
    const [modeDialog, setModeDialog] = React.useState<string>('');
    const [dataReservation, setDataReservation] = React.useState<TReservation>({} as TReservation);
    const [openDialog, setOpenDialog] = React.useState<boolean>(true);
    const [keyword, setKeyword] = useState("");
    const [dataTables, setDataTables] = useState<TMetaData<TReservation>>({} as TMetaData<TReservation>);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<string>('');
    const [totalStatusReservation, setTotalStatusReservation] = useState<TStatusReservation[]>([]);

    const tableRef = useRef<DataTableRef>(null);

    const paramsFilter =  {
        keyword : keyword,
        date: dateFilter
    }

    const getTotalStatusReservation = () => {
        requestGet<TApiResponse<TStatusReservation[]>>(`${RESERVATION}/status`)
            .then((res) => {
                if (res.success) {
                    setTotalStatusReservation(res.data);
                }
            }).finally(() => {
        })
    }

    React.useEffect(() => {
        getTotalStatusReservation();
    }, []);

    const getDataReservation = (status?: string, date?: string) => {
        setLoading(true);
        const params = {
            keyword: status ?? paramsFilter.keyword,
            date: date?? paramsFilter.date,
            page: 1,
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

    const handleRefreshDataTable = () => {
        tableRef.current?.refresh();
    };
    const clearAndRefresh = () => {
        setKeyword('');
        setDateFilter('');
        getDataReservation('', '');
    }

    const handleSearchEnter = () => {
        getDataReservation()
    }
    const getStatusGradient = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'linear-gradient(25deg, transparent 30%, hsl(39, 100%, 50%) 100%)'; // orange
            case 'confirmed':
                return 'linear-gradient(25deg, transparent 30%, rgba(0, 224, 11, 1) 100%)'; // green
            case 'canceled':
                return 'linear-gradient(25deg, transparent 30%, hsl(0, 80%, 50%) 100%)'; // red
            case 'rejected':
                return 'linear-gradient(25deg, transparent 30%, hsl(0, 80%, 50%) 100%)'; // red
            case 'completed':
                return 'linear-gradient(25deg, transparent 30%, hsl(210, 98%, 48%) 100%)'; // blue
            default:
                return 'linear-gradient(25deg, transparent 30%, #ccc 100%)'; // gray fallback
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <MoreHorizIcon color="action" fontSize="large"/>;
            case 'confirmed':
                return <ChecklistIcon color="action" fontSize="large"/>;
            case 'canceled':
                return <CloseIcon color="action" fontSize="large"/>;
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
                <DialogReservation
                    mode={modeDialog}
                    data={dataReservation}
                    openDialog={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onRefresh={handleRefreshDataTable}
                />
            )}
            <Box sx={{display: 'flex', gap: 4, mb: 4, mt: 2}}>
                {
                    statusReservation.map((val, idx) => (
                        <Card
                            key={idx}
                            onClick={() => {setKeyword(val); getDataReservation(val)}}
                            sx={{
                                flex: 1,
                                minWidth: 240,
                                maxWidth: 400,
                                background: `${getStatusGradient(val)} !important`,
                                cursor: 'pointer',
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                    <Box>
                                        <Typography variant="h5" color="textSecondary" component="div">
                                            {val.charAt(0).toUpperCase() + val.slice(1)}
                                        </Typography>
                                        <Typography color="textSecondary" variant="h2">
                                            {
                                                (totalStatusReservation.find((status) => status.status === val)?.total || <CircularProgress size={30} />)
                                            }

                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        background: getStatusGradient(val),
                                        border: '1px solid', borderColor: 'divider', borderRadius: '50%', p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {getStatusIcon(val)}
                                    </Box>
                                </Box>
                                <Typography color="text.secondary" variant="subtitle1">
                                    Total Reservations {val.charAt(0).toUpperCase() + val.slice(1)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                }

            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1}}>
                <Typography variant="h6" component="div">Data Reservations</Typography>
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
                        <DatePickerFormatter size="small" label="Filter by reservation date" value={dateFilter} onChange={(val) => {setDateFilter(val); getDataReservation(keyword, val)}}/>
                    </Box>
                    <SearchInput
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onEnter={handleSearchEnter}
                        onRefresh={clearAndRefresh}
                    />
                </Box>
            </Box>

            <DataTable<TReservation>
                ref={tableRef}
                params={paramsFilter}
                url={RESERVATION}
                columns={columns}
                data={dataTables}
                loading={loading}
                action
                onActionClick={onActionClick}/>
        </Box>
    );
}