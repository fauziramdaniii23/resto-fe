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
    size?: "small" | "medium";
    error?: boolean;
    shouldDisableDate?: (date: Dayjs) => boolean;
};

const DatePickerFormatter = ({label, value, onChange, sx, disabled, size = 'medium', error, shouldDisableDate}: DatePickerFormatter) => {
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
                        textField: {
                            size: size,
                            error: error,
                        },
                        openPickerButton: {
                            size: size,
                        },
                    }}
                    shouldDisableDate={shouldDisableDate}
                />
            </LocalizationProvider>
    );
};

export default DatePickerFormatter;
