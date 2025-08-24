import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

type TProps = {
    label: string;
    actionClick: () => void;
    loading: boolean;
}

const ButtonProgress = (props : TProps) => {
    const {loading, actionClick} = props;
    const submit = () => {
        actionClick()
    }
    return (
        <Button
            onClick={submit}
            variant='contained'
            endIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SendIcon/>}
        >
            {props.label}
        </Button>
    )
}

export default ButtonProgress;