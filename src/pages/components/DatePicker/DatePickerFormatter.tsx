import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';
import type {SxProps} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

type DatePickerFormatter = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    sx?: SxProps
};

const DatePickerFormatter = ({label, value, onChange, sx}: DatePickerFormatter) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                sx={sx}
                label={label}
                value={value ? dayjs(value) : null}
                onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                        onChange(newValue.format('YYYY-MM-DD'));
                    } else {
                        onChange('');
                    }
                }}
                slotProps={{
                    openPickerButton: {
                        sx: {
                            margin: '0 8px',
                            backgroundColor: '#32b2c3 !important',
                            borderRadius: 4,
                            '&:hover': {
                                backgroundColor: '#b6bebf',
                            },
                        },
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default DatePickerFormatter;
