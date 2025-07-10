import {useEffect, useState} from "react";
import {requestGet} from "@/api/api.ts";
import type {TApiPaginateResponse} from "@/type/type.ts";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

export type DataTableProps = {
    url: string;
    columns: Column<any>[];
};

export type Column<T> = {
    key: keyof T;
    label: string;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
    maxWidth?: number;
    format?: (value: any) => string;
};

export const DataTable = <T, >({url, columns}: DataTableProps) => {
    const [rows, setRows] = useState<T[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    const fetchData = async () => {
        setLoading(true);
        const params = {
            page: page,
            pageSize: pageSize,
        }
        requestGet<TApiPaginateResponse<T>>(url, params)
            .then((res) => {
                if (res.success) {
                    setRows(res.data ?? []);
                    setRowCount(res.total ?? 0);
                }
            }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

    const handlePageChange = (_:unknown, value:number) => {
        setPage(value);
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        setPageSize(Number(event.target.value));
    };
    console.log(loading)
    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            {columns.map((col) => (
                                <TableCell key={String(col.key)} align={col.align ?? "left"} sx={{ minWidth: col.minWidth, maxWidth: col.maxWidth }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                                {columns.map((col) => {
                                    const val = row[col.key as keyof T];
                                    return (
                                    <TableCell key={String(col.key)} align={col.align ?? "left"} sx={{ minWidth: col.minWidth, maxWidth: col.maxWidth }}>
                                        {col.format ? col.format(val) : String(row[col.key as keyof T])}
                                    </TableCell>
                                )})}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                    <Typography component="p">Rows per page</Typography>
                    <Select
                        value={pageSize}
                        onChange={handleChange}
                        size="small"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </Box>


                <Pagination count={Math.ceil(rowCount / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
};