import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import OrdersReservation from "@/pages/customer/orders/OrdersReservation.tsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useAuthStore} from "@/store/useAuthStore.ts";
import OrdersMenus from "@/pages/customer/orders/OrdersMenus.tsx";
import Button from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Orders() {
    const auth = useAuthStore((state) => state);
    const [value, setValue] = React.useState(0);

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        e.stopPropagation()
        setValue(newValue);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                pt: {xs: 16, sm: 16, md: 12}
            }}
        >
            <Box sx={{ width: '100%', pt:2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Menus" />
                        <Tab label="Reservations" />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {
                        auth.isAuthenticated ? (
                            <OrdersMenus/>
                        ) :
                        <CardContentNo label="Menus"/>
                    }
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    { auth.isAuthenticated ? (
                        <OrdersReservation/>
                    ) : (
                        <CardContentNo label="Reservations"/>
                    )}
                </CustomTabPanel>
            </Box>
        </Container>
    );
}

type CardContentNoProps = {
    label: string;
}
const CardContentNo = ({label}: CardContentNoProps) => {
    return (
        <Card sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <CardContent>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, my: 4}}>
                    <Typography>You must <b>Login</b> to view orders <b>{label}</b></Typography>
                    <Button
                        component={RouterLink}
                        to="/SignIn"
                        color="primary"
                        variant="contained"
                        size="small"
                    >
                        Sign in
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}
