import * as React from 'react';
import {styled} from '@mui/material/styles';
import type {Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppTheme from "@/theme/AppTheme.tsx";
import Logo from "@/pages/customer/components/Logo.tsx";
import {getMenuById} from "@/pages/admin/util/navigation.tsx";
import {SideMenu} from "@/pages/admin/dashboard/components/SideMenu.tsx";
import {List} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Container from "@mui/material/Container";
import {DashboardAppBarr} from "@/pages/admin/dashboard/components/AppBarr.tsx";
import {MainContent} from "@/pages/admin/dashboard/components/MainContent.tsx";
import {IconButtonSideBar} from "@/pages/components/button/styleIconButton.tsx";
import {DashboardMenus} from "@/pages/admin/util/dashboardMenus.tsx";
import {BreadcrumbsMenus} from "@/pages/admin/util/breadcrumbsMenus.tsx";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'visible',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'visible',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(10)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({open}) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({open}) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);


export default function Dashboard ({idMenu}: {idMenu: string}) {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();

    const handleClick = () => {
        setOpen(!open);
    };

    const getIconButtonPosition = () => {
        if (open) {
            return drawerWidth - 20;
        } else {
            return `calc(${theme.spacing(10)} + 1px - 20px)`;
        }
    };

    return (
        <AppTheme>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Drawer variant="permanent" open={open}
                        sx={{
                            '& .MuiDrawer-paper': {
                                overflowY: 'scroll',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                            },
                        }}
                >
                    <DrawerHeader
                        sx={{position: 'relative', zIndex: 'appBar'}}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            position: 'relative',
                        }}>
                            <Logo/>
                            {open && <Typography
                                color="text.primary"
                                sx={{
                                    fontSize: '1.8rem',
                                    fontWeight: 500,
                                    ml: 1,
                                    fontFamily: '"Lovers Quarrel", cursive',
                                    letterSpacing: '.1rem',
                                }}
                            >
                                Resto Bahari
                            </Typography>}
                        </Box>
                    </DrawerHeader>
                    <Divider/>
                    <List>
                        <SideMenu
                            menus={DashboardMenus}
                            idMenu={idMenu}
                            open={open}
                        />
                    </List>
                    <Divider sx={{marginTop: '1rem'}}/>
                </Drawer>
                <IconButtonSideBar
                    size="small"
                    onClick={handleClick}
                    sx={{
                        zIndex: 999999,
                        position: 'fixed',
                        left: getIconButtonPosition(),
                        top: 45,
                        borderRadius: '50%',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButtonSideBar>

                <Box
                    sx={{
                        width:'100%',
                    }}
                >
                    <DashboardAppBarr
                        items={getMenuById(BreadcrumbsMenus, idMenu)}
                    />
                    <Container
                        maxWidth={false}
                        sx={{p:2, ml: 0, mr: 0}}
                    >
                        <MainContent idMenu={idMenu}/>
                    </Container>
                </Box>
            </Box>
        </AppTheme>
    );
}