import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {
    DASHBOARD_HOME, DASHBOARD_MENUS, DASHBOARD_ORDERS,
    DASHBOARD_RESERVATION,
    DASHBOARD_TABLES,
    type MenusExtended
} from "@/pages/admin/util/navigation.tsx";
import {useNavigate} from "react-router-dom";
import {IconButtonSideMenu} from "@/pages/components/button/styleIconButton.tsx";
import Divider from "@mui/material/Divider";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import {useMenuStore} from "@/store/useMenuStore.ts";

const iconMap: Record<string, React.ReactElement> = {
    home: <HomeIcon/>,
    settings: <SettingsIcon/>,
    reservation: <BookmarkAddIcon/>,
    orders: <FormatListBulletedAddIcon/>,
    menus: <FastfoodIcon/>,
    tables: <TableRestaurantIcon/>,
    notFound: <NotInterestedIcon/>,
};

interface SideMenuProps {
    items: MenusExtended[];
    onItemClick?: (id: string) => void;
    open?: boolean;
}

export const SideMenu = ({items, open}: SideMenuProps) => {
    const navigate = useNavigate();
    const menuStore = useMenuStore((state) => state);

    const handleListItemClick = (menu : MenusExtended) => {
        menuStore.setMenu(menu.id, menu.label)
        switch (menu.id) {
            case DASHBOARD_HOME:
                navigate('/Dashboard');
                break;
            case DASHBOARD_RESERVATION:
                navigate('/Dashboard/Reservation');
                break;
            case DASHBOARD_ORDERS:
                navigate('/Dashboard/Orders');
                break;
            case DASHBOARD_MENUS:
                navigate('/Dashboard/Menus');
                break;
            case DASHBOARD_TABLES:
                navigate('/Dashboard/Tables');
                break;
            default:
                navigate('/PageNotFound');
                break;
        }
    };

    return (
        <>
            {items.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : iconMap['notFound'];

                if (hasChildren) {
                    return (
                        <>
                        <Accordion key={item.id} defaultExpanded disableGutters elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}
                                  sx={{
                                      '& .MuiAccordionSummary-content': {
                                          display: open ? 'flex' : 'none',
                                      }
                                  }}
                            >
                                {open && <Typography color="text.secondary">{item.label}</Typography>}
                            </AccordionSummary>
                            <AccordionDetails sx={{padding: 0}}>
                                <List disablePadding>
                                    <SideMenu items={item.children!} open={open}/>
                                </List>
                            </AccordionDetails>
                        </Accordion><Divider/>
                        </>
                    );
                } else {
                    return (
                        <ListItem key={item.id} component="div" disablePadding
                            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            {
                                open ? (
                                    <ListItemButton
                                        selected={menuStore.id === item.id}
                                        onClick={() => handleListItemClick(item)}
                                    >
                                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={item.label}/>
                                    </ListItemButton>
                                ) : (
                                    <IconButtonSideMenu
                                        onClick={() => handleListItemClick(item)}
                                    >
                                        {icon}
                                    </IconButtonSideMenu>
                                )
                            }
                        </ListItem>

                    );
                }
            })}
        </>
    );
};
