import {type ReactNode, useEffect, useState} from "react";
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
import {Skeleton} from "@mui/material";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type Column<T> = {
    key: keyof T;
    label: string;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
    maxWidth?: number;
    format?: (value: any, row: T) => ReactNode;
};
export type DataTableProps<T> = {
    url: string;
    columns: Column<T>[];
    maxHeight?: number;
    action?: boolean;
    onActionClick?: (mode: 'view' | 'edit' | 'delete', data: T) => void;
};

type ActionMenuProps = {
    onClick: (mode: 'view' | 'edit' | 'delete') => void;
};

function ActionMenu({onClick}: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (mode?: 'view' | 'edit' | 'delete') => {
        setAnchorEl(null);
        if (mode) onClick(mode);
    };

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon/>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
                <MenuItem onClick={() => handleClose('view')}>View</MenuItem>
                <MenuItem onClick={() => handleClose('edit')}>Edit</MenuItem>
                <MenuItem onClick={() => handleClose('delete')}>Delete</MenuItem>
            </Menu>
        </>
    );
}

export const DataTable = <T, >({url, columns, maxHeight, action, onActionClick}: DataTableProps<T>) => {
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

    const handlePageChange = (_: unknown, value: number) => {
        setPage(value);
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        setPageSize(Number(event.target.value));
    };
    const createColumns: Column<T>[] = [
        ...columns,
        ...(action
            ? [{
                key: "action" as keyof T,
                label: "Action",
                align: "center",
                minWidth: 100,
                maxWidth: 150,
            }] as Column<T>[]
            : []),
    ];
    return (
        <Box>
            <TableContainer component={Paper} sx={{maxHeight: maxHeight ?? 500}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            {createColumns.map((col) => (
                                <TableCell key={String(col.key)} align={col.align ?? "left"}
                                           sx={{minWidth: col.minWidth, maxWidth: col.maxWidth}}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({length: pageSize}).map((_, i) => (
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell>
                                        <Skeleton variant="text" width={20}/>
                                    </TableCell>
                                    {createColumns.map((_, j) => (
                                        <TableCell key={`skeleton-${i}-${j}`}>
                                            <Skeleton variant="text" width="100%" height={20}/>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={createColumns.length + 1}>
                                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                                        <SentimentDissatisfiedIcon fontSize="large" color="disabled"/>
                                        <Typography variant="body1" color="textSecondary">
                                            Data Not Found
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>

                                    {createColumns.map((col) => {
                                        const isActionCol = col.key === 'action';
                                        const val = row[col.key as keyof T];

                                        return (
                                            <TableCell
                                                key={String(col.key)}
                                                align={col.align ?? 'left'}
                                                sx={{minWidth: col.minWidth, maxWidth: col.maxWidth}}
                                            >
                                                {isActionCol ? (
                                                    <ActionMenu
                                                        onClick={(mode) => onActionClick?.(mode, row)}
                                                    />
                                                ) : (
                                                    col.format ? col.format(val, row) : String(val)
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mr: 2}}>
                    <Typography component="p">Rows per page</Typography>
                    <Select
                        value={pageSize}
                        onChange={handleChange}
                        size="small"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </Box>

                <Pagination count={Math.ceil(rowCount / pageSize)}
                            page={page}
                            onChange={handlePageChange}
                />
            </Box>
        </Box>
    );
};