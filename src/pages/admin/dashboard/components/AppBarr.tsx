import Typography from "@mui/material/Typography";
import ColorModeIconDropdown from "@/theme/ColorModeIconDropdown.tsx";
import Container from "@mui/material/Container";
import React, {useEffect, useState} from "react";
import {getBreadcrumbPath, Menus, type MenusExtended} from "@/pages/admin/util/navigation.tsx";
import {Breadcrumbs} from "@mui/material";
import Box from "@mui/material/Box";
import { Search } from "@/pages/customer/components/MainContent"

type AppBarrProps = {
    items?: MenusExtended
}

export const DashboardAppBarr: React.FC<AppBarrProps> = ({ items }) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const path = getBreadcrumbPath(Menus, items?.id) || [];

    const breadcrumbs = path.map((item, index) => {
        const isLast = index === path.length - 1;
        return isLast ? (
            <Typography variant="h6" key={item.id} color="text.primary">
                {item.label}
            </Typography>
        ) : (
            <Typography variant="h6" key={item.id} color="inherit">
                {item.label}
            </Typography>
        );
    });

    return (
        <Container
            maxWidth={false}
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                backdropFilter: 'blur(10px)',
                border: scrolled ? '1px solid' : 'none',
                borderColor: 'divider',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                boxShadow: scrolled? 1 : 'none',
            }}
        >
            <Breadcrumbs separator=">" >{breadcrumbs}</Breadcrumbs>
            <Box
             sx={{
                 display: 'flex',
                 gap: 2,
             }}
            >
                <Search/>
                <ColorModeIconDropdown size="medium"/>
            </Box>
        </Container>
    )
}