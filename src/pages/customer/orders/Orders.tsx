import Container from '@mui/material/Container';
import ReservationOrders from "@/pages/customer/orders/ReservationOrders.tsx";

export default function Orders() {
    return (
        <Container
            maxWidth={false}
            sx={{
                pt: {xs: 16, sm: 16, md: 12}
            }}
        >
           <ReservationOrders/>
        </Container>
    );
}
