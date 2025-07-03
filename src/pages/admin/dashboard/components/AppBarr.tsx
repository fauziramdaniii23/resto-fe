import Typography from "@mui/material/Typography";
import ColorModeIconDropdown from "@/theme/ColorModeIconDropdown.tsx";
import Container from "@mui/material/Container";
import {useEffect, useState} from "react";

export const DashboardAppBarr = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
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
                mb: 2,
                p: 1,
                backdropFilter: 'blur(10px)',
                border: scrolled ? '1px solid' : 'none',
                borderColor: 'divider',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                boxShadow: scrolled? 1 : 'none',
            }}
        >
            <Typography>Test</Typography>
            <ColorModeIconDropdown size="medium"/>
        </Container>
    )
}