import Typography from "@mui/material/Typography";
import ColorModeIconDropdown from "@/theme/ColorModeIconDropdown.tsx";
import Container from "@mui/material/Container";
import React, {useEffect, useState} from "react";
import {
    getBreadcrumbPath,
    type MenusExtended
} from "@/pages/admin/util/navigation.tsx";
import {Breadcrumbs} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom";
import Link from "@mui/material/Link";
import {BreadcrumbsMenus} from "@/pages/admin/util/breadcrumbsMenus.tsx";
import {useRedirect} from "@/pages/util/useRedirect.tsx";

type AppBarrProps = {
    items?: MenusExtended
}

export const DashboardAppBarr: React.FC<AppBarrProps> = ({ items }) => {
    const navigate = useNavigate();
    const redirect = useRedirect()
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const path = getBreadcrumbPath(BreadcrumbsMenus, items?.id) || [];

    const handleBreadcrumbClick = (selectedMenus : MenusExtended) => {
        redirect(selectedMenus);
    }

    const breadcrumbs = path.map((item, index) => {
        const isLast = index === path.length - 1;
        return isLast ? (
            <Typography variant="h6" key={item.id} color="text.primary">
                {item.label}
            </Typography>
        ) : (
            <Link sx={{ cursor: "pointer", fontSize: "1.25rem" }} onClick={() => item.route && handleBreadcrumbClick(item)} variant="h6" key={item.id} color="inherit">
                {item.label}
            </Link>
        );
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <Breadcrumbs separator="›" >{breadcrumbs}</Breadcrumbs>
            <Box
             sx={{
                 display: 'flex',
                 gap: 2,
             }}
            >
                <ColorModeIconDropdown size="medium"/>
                <IconButton onClick={handleClick}>
                    <PersonIcon/>
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => navigate('/Home')}>Home</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </Box>
        </Container>
    )
}