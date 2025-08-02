import Box from "@mui/material/Box";
import type {TApiPaginateResponse, TMetaData, TTables} from "@/type/type.ts";
import {TABLES} from "@/api/url.ts";
import {type Column, DataTable, type DataTableRef} from "@/pages/components/DataTable/Table.tsx";
import React, {useRef, useState} from "react";
import {formatDate} from "@/pages/util/parsingdate.ts";
import DialogTables from "@/pages/admin/dashboard/customers/TablesDashboard/DialogTables.tsx";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "@/pages/components/Search.tsx";
import {CREATE} from "@/constant";
import {requestGet} from "@/api/api.ts";

const columns: Column<TTables>[] = [
    {
        key: 'table_number',
        label: 'Table Number',
        format: (val) => `Table ${val}`,
    },
    {
        key: 'capacity',
        label: 'Capacity',
        format: (value: number) => `${value} Persons`
    },
    {
        key: 'created_at',
        label: 'Created At',
        format: (val) => formatDate(val)
    },
    {
        key: 'updated_at',
        label: 'Updated At',
        format: (val) => formatDate(val)
    }
]

export const Tables = () => {
    const tableRef = useRef<DataTableRef>(null);
    const [dataTables, setDataTables] = useState<TMetaData<TTables>>({} as TMetaData<TTables>);
    const [dataDialogTables, setDataDialogTables] = useState<TTables>({} as TTables);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [modeDialog, setModeDialog] = React.useState<string>('');
    const [keyword, setKeyword] = useState<string>('');

    const onActionClick = (mode: string, data: TTables) => {
        setDataDialogTables(data);
        setModeDialog(mode);
        if (data && mode) {
            setOpenDialog(true);
        }
    }
    const paramsTables = {
        keyword : keyword
    }

    const handleAddTable = () => {
        setModeDialog(CREATE);
        setDataDialogTables({} as TTables);
        setOpenDialog(true);
    }

    const handleSearchEnter = () => {
        getDataTables()
    }
    const clearAndRefresh = () => {
        setKeyword('');
        getDataTables('');
    }
    const handleRefresh = () => {
        tableRef.current?.refresh();
    }

    const getDataTables = (paramsKeyword?:string) => {
        setLoading(true);
        const params = {
            keyword: paramsKeyword ?? keyword,
            page: 1,
            pageSize: tableRef.current?.getPageSize(),
        }
        requestGet<TApiPaginateResponse<TTables>>(TABLES, params)
            .then((res) => {
                if (res.success) {
                    setDataTables(res.meta_data as TMetaData<TTables>);
                }
            }).finally(() => {
                setLoading(false);
        })
    }

    return (
        <Box>
            {openDialog && modeDialog && (
                <DialogTables
                    mode={modeDialog}
                    data={dataDialogTables}
                    openDialog={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onRefresh={handleRefresh}
                />
            )}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1}}>
                <Typography variant="h6" component="div">Data Tables</Typography>
                <Box sx={{display: 'flex', justifyContent: 'end', gap: 2}}>
                    <IconButton
                        sx={{
                            width: 40,
                        }}
                        size="small"
                        onClick={handleAddTable}
                    >
                        <AddIcon/>
                    </IconButton>
                    <SearchInput
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onEnter={handleSearchEnter}
                        onRefresh={clearAndRefresh}
                    />
                </Box>
            </Box>
            <DataTable<TTables>
                ref={tableRef}
                url={TABLES}
                params={paramsTables}
                columns={columns}
                data={dataTables}
                loading={loading}
                action
                onActionClick={onActionClick}/>
        </Box>
    )
}