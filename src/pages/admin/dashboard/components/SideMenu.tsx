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
import SettingsIcon from '@mui/icons-material/Settings';
import type {MenusExtended} from "@/pages/admin/util/navigation.tsx";

const iconMap: Record<string, React.ReactElement> = {
    home: <HomeIcon />,
    settings: <SettingsIcon />,
};

interface SideMenuProps {
    items: MenusExtended[];
    selectedId: string | null;
    onItemClick?: (id: string) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ items, selectedId, onItemClick }) => {

    const handleListItemClick = (id: string) => {
        onItemClick?.(id);
    };

    return (
        <>
            {items.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const icon = item.icon && iconMap[item.icon];

                if (hasChildren) {
                    return (
                        <Accordion key={item.id} defaultExpanded disableGutters elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography color="text.secondary"
                                >{item.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List disablePadding>
                                    <SideMenu items={item.children!} onItemClick={onItemClick} selectedId={selectedId} />
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
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                }
            })}
        </>
    );
};
