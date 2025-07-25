import Container from '@mui/material/Container';
import MainContent from './MainContent.tsx';
import Latest from '../components/Latest.tsx';
import {Hero} from "../components/Hero.tsx";
import Box from "@mui/material/Box";

export default function Home() {
    return (
        <Box>
            <Hero/>
            <Container
                maxWidth={false}
                component="main"
                sx={{display: 'flex', flexDirection: 'column', mb: 16, mt:6, gap: 4}}
            >
                <MainContent/>
                <Latest/>
            </Container>
        </Box>
    );
}
