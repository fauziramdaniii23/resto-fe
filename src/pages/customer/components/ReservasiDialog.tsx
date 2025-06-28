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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

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
                <DialogTitle>{"Reservation Now?"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                        <DatePickerFormatter
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            label="Reservasi Date"
                            sx={{width: '100%'}}
                        />
                        <TimePickerFormatter
                            value={time}
                            onChange={(newValue) => setTime(newValue)}
                            label="Reservasi Time"
                            sx={{width: '100%'}}
                        />
                        <TextField type="number" id="outlined-basic" label="number of guests" variant="outlined" />
                    </Box>

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