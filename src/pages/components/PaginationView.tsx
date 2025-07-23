import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";

interface PaginationViewsProps {
    pageSizeValue?: number[];
    showPageSize?: boolean;
    rowCount: number;
    onChange: (page: number, pageSize: number) => void;
}

const PaginationViews = ({pageSizeValue = [5, 10, 25, 100], showPageSize = false, rowCount, onChange,}: PaginationViewsProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeValue[0]);

    const handlePageChange = (_: unknown, value: number) => {
        setPage(value);
        if(value != page){
            onChange(value, pageSize);
        }
    };

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        onChange(page, newSize);
    };

    useEffect(() => {
        onChange(page, pageSize);
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {showPageSize && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                    <Typography component="p">Rows per page</Typography>
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        size="small"
                    >
                        {pageSizeValue.map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            <Pagination
                count={Math.ceil(rowCount / pageSize)}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                size="small"
            />
        </Box>
    );
};

export default PaginationViews;
