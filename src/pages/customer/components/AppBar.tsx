import {alpha, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Logo from './Logo.tsx';
import ColorModeIconDropdown from "@/theme/ColorModeIconDropdown.tsx";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {requestPost} from "@/api/api.ts";
import type {TApiResponse, Void} from "@/type/type.ts";
import {useState} from "react";
import ShoppingCart from "./ShoppingCart.tsx";
import Typography from "@mui/material/Typography";
import {Profile} from "@/pages/components/Profile.tsx";
import {SUPER_ADMIN} from "@/constant";
import {CONTACT_US, HISTORY, HOME, ORDERS} from "@/pages/customer/type/CustomerNavigation.tsx";

export const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

type Props = {
    menu: string;
}

export default function AppAppBar({ menu }: Props) {
    const [open, setOpen] = useState(false);

    const auth = useAuthStore((state) => state);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        requestPost<TApiResponse<Void>>('/logout')
            .then(() => {
                logout();
            }).finally(() => {
                navigate('/SignIn');
        })
    };

    const appBarNavigations = [HOME, ORDERS, HISTORY, CONTACT_US];

    const handleNavigationClick = (label: string) => {

        switch (label) {
            case HOME:
                navigate('/Home');
                break;
            case ORDERS:
                navigate('/Orders');
                break;
            case HISTORY:
                navigate('/History');
                break;
            case CONTACT_US:
                navigate('/ContactUs');
                break;
            default:
                navigate('/PageNotFound');
        }
    }

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth={false}>
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                        <Logo/>
                        <Typography
                            color="text.primary"
                            sx={{
                                fontSize: '1.8rem',
                                fontWeight: 500,
                                ml: 1,
                                fontFamily: '"Lovers Quarrel", cursive',
                                letterSpacing: '.2rem',
                            }}
                        >
                            Resto Bahari
                        </Typography>
                        <Box sx={{display: {xs: 'none', md: 'flex', gap: 1, marginLeft: 10}}}>
                            {appBarNavigations.map((label) => (
                                <Button
                                    key={label}
                                    sx={{mx: 1}}
                                    variant={menu === label ? 'contained' : 'text'}
                                    color={menu === label ? 'primary' : 'info'}
                                    size="small"
                                    onClick={() => handleNavigationClick(label)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                    <Profile/>

                    <Box sx={{display: {xs: 'flex', md: 'none'}, gap: 1}}>
                        {
                            auth.isAuthenticated && (
                                <ShoppingCart/>
                            )
                        }
                        <ColorModeIconDropdown size="medium"/>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{p: 2, backgroundColor: 'background.default'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon/>
                                    </IconButton>
                                </Box>
                                {auth.user?.role === SUPER_ADMIN && (
                                    <MenuItem component={RouterLink} to="/Dashboard">Dashboard</MenuItem>
                                )}
                                {
                                    appBarNavigations.map((label) => (
                                        <MenuItem
                                            key={label}
                                            onClick={() => handleNavigationClick(label)}
                                        >
                                            {label}
                                        </MenuItem>
                                    ))
                                }
                                <Divider sx={{my: 3}}/>
                                {auth.isAuthenticated ? (
                                    <>
                                        <MenuItem>
                                            <Button color="primary" variant="contained" fullWidth>
                                                Profile
                                            </Button>
                                        </MenuItem>
                                        <MenuItem>
                                            <Button color="primary" variant="outlined" fullWidth onClick={handleLogout}>
                                                Sign out
                                            </Button>
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem>
                                            <Button color="primary" variant="contained" fullWidth
                                                    component={RouterLink}
                                                    to="/SignIn">
                                                Sign In
                                            </Button>
                                        </MenuItem>
                                        <MenuItem>
                                            <Button color="primary" variant="outlined" fullWidth
                                                    component={RouterLink}
                                                    to="/SignUp">
                                                Sign Up
                                            </Button>
                                        </MenuItem>
                                    </>
                                )}
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
