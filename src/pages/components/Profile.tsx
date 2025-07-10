import Box from "@mui/material/Box";
import ShoppingCart from "@/pages/customer/components/ShoppingCart.tsx";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import {SUPER_ADMIN} from "@/constant";
import MenuItem from "@mui/material/MenuItem";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import ColorModeIconDropdown from "@/theme/ColorModeIconDropdown.tsx";
import * as React from "react";
import {useState} from "react";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {requestPost} from "@/api/api.ts";
import type {TApiResponse, Void} from "@/type/type.ts";

export const Profile = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openDialogAvatar = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        requestPost<TApiResponse<Void>>('/logout')
            .then(() => {
                logout();
            }).finally(() => {
            navigate('/SignIn');
        })
    };
    return (
        <Box
            sx={{
                display: {xs: 'none', md: 'flex'},
                gap: 1,
                alignItems: 'center',
            }}
        >
            <Box sx={{mr: 4}}>
                <ShoppingCart/>
            </Box>
            {isAuthenticated ? (
                <>
                    <IconButton
                        sx={{
                            p: 0,
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                        }}
                        onClick={handleClick} size="small">
                        <Avatar sx={{width: 32, height: 32}}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={openDialogAvatar} onClose={handleClose}
                          // anchorOrigin={{
                          //     vertical: 'top',
                          //     horizontal: 'right',
                          // }}
                          // transformOrigin={{
                          //     vertical: 'top',
                          //     horizontal: 'left',
                          // }}
                          // PaperProps={{
                          //     sx: {
                          //         ml: 4,
                          //     },
                          // }}
                    >
                        {user?.role === SUPER_ADMIN && (
                            <MenuItem component={RouterLink} to="/Dashboard">Dashboard</MenuItem>
                        )}
                        <MenuItem component={RouterLink} to="/profile">Profile</MenuItem>
                        <MenuItem onClick={() => {
                            handleLogout()
                        }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <>
                    <Button
                        component={RouterLink}
                        to="/SignIn"
                        color="primary"
                        variant="text"
                        size="small"
                    >
                        Sign in
                    </Button>

                    <Button
                        component={RouterLink}
                        to="/SignUp"
                        color="primary"
                        variant="contained"
                        size="small"
                    >
                        Sign up
                    </Button>
                </>
            )}
            <ColorModeIconDropdown/>
        </Box>
    )
};