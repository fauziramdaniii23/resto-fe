import dayjs, {Dayjs} from 'dayjs';
import type {SxProps} from "@mui/material";
import {MobileTimePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

type TimePickerFormatter = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    sx?: SxProps
    disabled?: boolean;
};

const TimePickerFormatter = ({label, value, onChange, sx, disabled}: TimePickerFormatter) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
                disabled={disabled}
                sx={sx}
                label={label}
                ampm={false}
                format="HH:mm"
                value={value ? dayjs(value, 'HH:mm') : null}
                onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                        onChange(newValue.format('HH:mm'));
                    } else {
                        onChange('');
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default TimePickerFormatter;
