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
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import {DASHBOARD_HOME, DASHBOARD_RESERVATION, type MenusExtended} from "@/pages/admin/util/navigation.tsx";
import {useNavigate} from "react-router-dom";

const iconMap: Record<string, React.ReactElement> = {
    home: <HomeIcon/>,
    settings: <SettingsIcon/>,
    reservation: <BookmarkAddIcon/>,
};

interface SideMenuProps {
    items: MenusExtended[];
    selectedId: string | null;
    onItemClick?: (id: string) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({items, selectedId}) => {
    const navigate = useNavigate();

    const handleListItemClick = (id: string) => {
        switch (id) {
            case DASHBOARD_HOME:
                navigate('/Dashboard');
                break;
            case DASHBOARD_RESERVATION:
                navigate('/Dashboard/Reservation');
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
                const icon = item.icon && iconMap[item.icon];

                if (hasChildren) {
                    return (
                        <Accordion key={item.id} defaultExpanded disableGutters elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography color="text.secondary"
                                >{item.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List disablePadding>
                                    <SideMenu items={item.children!} selectedId={selectedId}/>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                } else {
                    return (
                        <ListItem key={item.id} component="div" disablePadding>
                            <ListItemButton
                                selected={selectedId === item.id}
                                onClick={() => handleListItemClick(item.id)}
                            >
                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={item.label}/>
                            </ListItemButton>
                        </ListItem>
                    );
                }
            })}
        </>
    );
};
