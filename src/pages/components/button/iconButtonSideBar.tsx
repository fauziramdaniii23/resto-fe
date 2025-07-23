import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

export const IconButtonSideBar = styled(IconButton)(({theme}) => ({
    backgroundColor: 'oklch(98.4% 0.003 247.858)',
    ...theme.applyStyles('dark', {
        backgroundColor: 'oklch(12.9% 0.042 264.695)',
    })
}));