import { FourSquare} from "react-loading-indicators";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type LoaderProps = {
    show: boolean;
};

const Loader = ({ show }: LoaderProps) => {
    return (
        <Backdrop
            open={show}
            sx={{
                zIndex: (theme) => theme.zIndex.modal + 1,
                color: "#fff",
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Please wait...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default Loader;
