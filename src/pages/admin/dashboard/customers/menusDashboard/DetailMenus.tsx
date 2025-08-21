import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useMenuStore} from "@/store/useMenuStore.ts";

export const DetailMenus = () => {
    const menu = useMenuStore((state) => state)
    return (
        <Box>
            <Typography>{menu.name}</Typography>
            <Typography>test</Typography>
        </Box>
    )
}