import Container from '@mui/material/Container';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';
import Box from "@mui/material/Box";

export default function Orders() {
    return (
        <Box>
            <Container
                maxWidth={false}
                component="main"
                sx={{display: 'flex', flexDirection: 'column', mb: 16, mt:6, gap: 4}}
            >
                <MainContent/>
                <Latest/>
            </Container>
            <Footer/>
        </Box>
    );
}
