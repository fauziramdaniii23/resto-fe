import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import ReservationOrders from "@/pages/customer/orders/ReservationOrders.tsx";

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
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
                    Oeders Menus Comming Soon...
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <ReservationOrders/>
                </CustomTabPanel>
            </Box>
        </Container>
    );
}
