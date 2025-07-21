import {BlinkBlur, FourSquare} from "react-loading-indicators";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type LoaderProps = {
    size?: 'small' | 'medium' | 'large';
    show: boolean;
    fullScreen?: boolean;
};

const Loader = ({show, fullScreen, size}: LoaderProps) => {
    return (
        <Backdrop
            open={show}
            sx={{
                position: fullScreen ? 'fixed' : 'absolute',
                zIndex: (theme) => theme.zIndex.modal + 1,
                color: "#fff",
                backdropFilter: "blur(4px)",
                backgroundColor: 'transparent',
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                {
                    fullScreen ? (
                        <>
                            <FourSquare size={size ? size : "large"} color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}/>
                            <Typography variant="subtitle1" sx={{my: 2, fontStyle: 'italic'}}>
                                Please wait...
                            </Typography>
                        </>
                    ) : (
                        <>
                            <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} size={size ? size : "medium"} textColor="#327fcd"/>
                            <Typography variant="subtitle1" sx={{my: 2, fontStyle: 'italic'}}>
                                Loading...
                            </Typography>
                        </>
                    )
                }
            </Box>
        </Backdrop>
    );
};

export default Loader;
