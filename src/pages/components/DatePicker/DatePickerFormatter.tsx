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
    disabled?: boolean;
};

const DatePickerFormatter = ({label, value, onChange, sx, disabled}: DatePickerFormatter) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                disabled={disabled}
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
                            borderRadius: 4,
                        },
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default DatePickerFormatter;
