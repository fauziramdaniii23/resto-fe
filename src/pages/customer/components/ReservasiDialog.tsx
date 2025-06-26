import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type {TransitionProps} from '@mui/material/transitions';
import SendIcon from "@mui/icons-material/Send";
import DatePickerFormatter from "@/pages/components/DatePicker/DatePickerFormatter.tsx";
import TimePickerFormatter from "@/pages/components/DatePicker/TimePickerForrmatter.tsx";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function ReservasiDialog() {

    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        console.log('tanggal :', date);
        console.log('waktu :', time);
    }

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{minWidth: 'fit-content'}}
                onClick={handleClickOpen}
            >
                Click here to Reservasi
            </Button>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle>{"Reservasi Sekarang?"}</DialogTitle>
                <DialogContent>
                    <DatePickerFormatter
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        label="Tanggal Reservasi"
                        sx={{width: '100%'}}
                    />
                    <TimePickerFormatter
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        label="Waktu Reservasi"
                        sx={{width: '100%'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={handleSubmit}
                        endIcon={<SendIcon/>}
                    >Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}