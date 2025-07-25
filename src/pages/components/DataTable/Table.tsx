import {forwardRef, type ReactNode, useEffect, useImperativeHandle, useState} from "react";
import {requestGet} from "@/api/api.ts";
import type {TApiPaginateResponse, TMetaData} from "@/type/type.ts";
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
import {ListItemIcon, ListItemText, Skeleton} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';
import DataNotFound from "@/pages/components/DataNotFound.tsx";

export type TActionMenu = 'view' | 'edit' | 'delete';

export type Column<T> = {
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
    maxWidth?: number;
    format?: (value: any, row: T) => ReactNode;
};

type ActionMenuProps = {
    onClick: (mode: TActionMenu) => void;
};

export type DataTableRef = {
    refresh: () => void;
    getPage: () => number;
    getPageSize: () => number;
};

export type DataTableProps<T> = {
    url: string;
    params?: Record<string, unknown>;
    columns: Column<T>[];
    data: TMetaData<T>;
    loading: boolean;
    maxHeight?: number;
    action?: boolean;
    onActionClick?: (mode: TActionMenu, data: T) => void;
};

export const DataTable = forwardRef(InnerDataTable) as <T>(
    props: DataTableProps<T> & { ref?: React.Ref<DataTableRef> }
) => React.ReactElement;

function InnerDataTable<T>( props: DataTableProps<T>, ref: React.Ref<DataTableRef>) {
    const { url, columns, maxHeight, action, onActionClick } = props;
    const [rows, setRows] = useState<T[]>(props.data.data ?? []);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(props.loading);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(5);


    const fetchData = async (page?:number, pageSize?:number) => {
        setLoading(true);
        const params = {
            ...props.params,
            page: page ?? currentPage,
            pageSize: pageSize ?? currentPageSize,
        }
        requestGet<TApiPaginateResponse<T>>(url, params)
            .then((res) => {
                if (res.success) {
                    setRows(res.meta_data.data ?? []);
                    setRowCount(res.meta_data.total ?? 0);
                }
            }).finally(() => {
            setLoading(false);
        })
    };

    useImperativeHandle(ref, () => ({
        refresh: fetchData,
        getPage: () => currentPage,
        getPageSize: () => currentPageSize,
    }));

    useEffect(() => {
        setRows(props.data.data ?? []);
        setRowCount(props.data.total ?? 0);
        setCurrentPage(1)
    }, [props.data]);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

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
    useEffect(() => {
        fetchData()
    }, [])
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
                            Array.from({length: currentPageSize}).map((_, i) => (
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
                                    <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                                        <DataNotFound/>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{(currentPage - 1) * currentPageSize + i + 1}</TableCell>

                                    {createColumns.map((col) => {
                                        const isActionCol = col.key === 'action';
                                        const rawKey = col.key.includes('.') ? col.key.split('.')[0] : col.key;
                                        const val = row[rawKey as keyof T];

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
                        value={currentPageSize}
                        onChange={(event: SelectChangeEvent<number>) => {setCurrentPageSize(event.target.value); fetchData(currentPage,event.target.value)}}
                        size="small"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </Box>

                <Pagination count={Math.ceil(rowCount / currentPageSize)}
                            page={currentPage}
                            onChange={(_, val) => {setCurrentPage(val); fetchData(val)}}
                />
            </Box>
        </Box>
    );
}

function ActionMenu({onClick}: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (mode?: TActionMenu) => {
        setAnchorEl(null);
        if (mode) onClick(mode);
    };
    const actionMenu: TActionMenu[] = [
        'view', 'edit', 'delete',
    ]

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <MoreVertIcon/>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
                {
                    actionMenu.map((mode) => (
                        <MenuItem sx={{mr:2}} onClick={() => handleClose(mode)}>
                            <ListItemIcon>
                                {mode === 'view' && <VisibilityIcon/>}
                                {mode === 'edit' && <EditSquareIcon/>}
                                {mode === 'delete' && <DeleteIcon/>}
                            </ListItemIcon>
                            <ListItemText>{mode.charAt(0).toUpperCase() + mode.slice(1)}</ListItemText>
                        </MenuItem>
                    ))
                }
            </Menu>
        </>
    );
}
