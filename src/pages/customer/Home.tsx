import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppAppBar from './components/AppBar.tsx';
import MainContent from './components/MainContent';
import Latest from './components/Latest';
import Footer from './components/Footer';
import AppTheme from "../../theme/AppTheme.tsx";
import {Hero} from "./components/Hero.tsx";

export default function Home(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <AppAppBar/>
            <Hero/>
            <Container
                maxWidth={false}
                component="main"
                sx={{display: 'flex', flexDirection: 'column', mb: 16, mt:6, gap: 4}}
            >
                <MainContent/>
                <Latest/>
            </Container>
            <Footer/>
        </AppTheme>
    );
}
