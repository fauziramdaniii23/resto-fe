import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/AppBar.tsx';
import Footer from './components/Footer';
import AppTheme from "../../theme/AppTheme.tsx";
import Home from "./home/Home.tsx";
import Orders from "@/pages/customer/orders/Orders.tsx";
import * as React from "react";

type CustomerPageProps = {
    menu: string;
    disableCustomTheme?: boolean;
}

const ContentMap: Record<string, React.ReactElement> = {
    Home: <Home/>,
    Orders: <Orders/>
}

export default function CustomerPages(props: CustomerPageProps) {

    const ContentComponent = ContentMap[props.menu];

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <AppAppBar menu={props.menu}/>
            { ContentComponent }
            <Footer/>
        </AppTheme>
    );
}
