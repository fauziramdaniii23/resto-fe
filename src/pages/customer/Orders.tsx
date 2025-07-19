import Container from '@mui/material/Container';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Orders() {
    return (
        <Box
            sx={{
                pt: { xs: 16, sm: 16, md: 6 },
            }}
        >
            <Container
                maxWidth={false}
                component="main"
                sx={{display: 'flex', flexDirection: 'column', mb: 16, mt:6, gap: 4}}
            >
                <Typography component="h1" variant="h5">UI Orders Cooming Soon</Typography>
            </Container>
        </Box>
    );
}
