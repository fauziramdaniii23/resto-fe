import {forwardRef, type ReactNode, useEffect, useImperativeHandle, useRef, useState} from "react";
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
import {ListItemIcon, ListItemText, Skeleton} from "@mui/material";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';

export type TActionMenu = 'view' | 'edit' | 'delete';

export type Column<T> = {
    key: string;
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
    onActionClick?: (mode: TActionMenu, data: T) => void;
};

type ActionMenuProps = {
    onClick: (mode: TActionMenu) => void;
};

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

export type DataTableRef = {
    refresh: () => void;
};

function InnerDataTable<T>(
    props: DataTableProps<T>,
    ref: React.Ref<DataTableRef>
) {
    const { url, columns, maxHeight, action, onActionClick } = props;
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

    const isFirstRender = useRef(true);

    useImperativeHandle(ref, () => ({
        refresh: fetchData
    }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

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
}

export const DataTable = forwardRef(InnerDataTable) as <T>(
    props: DataTableProps<T> & { ref?: React.Ref<DataTableRef> }
) => React.ReactElement;
