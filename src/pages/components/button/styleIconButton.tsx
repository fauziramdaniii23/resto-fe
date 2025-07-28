import {styled} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import {backgroundTheme} from "@/theme/themePrimitives.ts";

export const IconButtonSideBar = styled(IconButton)(({theme}) => ({
    backgroundColor: backgroundTheme.light,
    ...theme.applyStyles('dark', {
        backgroundColor: backgroundTheme.dark,
    })
}));

export const IconButtonSideMenu = styled(IconButton)(({theme}) => ({
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: theme.shape.borderRadius,
}));

export const IconButtonEdit = styled(IconButton)(({theme}) => ({
    backgroundColor: backgroundTheme.light,
    '&:hover': {
        backgroundColor: 'oklch(98.4% 0.003 247.858)',
        scale: 1.05,
    },
    ...theme.applyStyles('dark', {
        backgroundColor: backgroundTheme.dark,
        '&:hover': {
            backgroundColor: 'oklch(12.9% 0.042 264.695)',
        },
    }),
}));