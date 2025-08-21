import * as React from 'react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import type {ThemeOptions} from '@mui/material/styles';
import {inputsCustomizations} from './customizations/inputs';
import {feedbackCustomizations} from './customizations/feedback';
import {navigationCustomizations} from './customizations/navigation';
import {surfacesCustomizations} from './customizations/surfaces.tsx';
import {colorSchemes, typography, shape} from './themePrimitives';
import {useMemo} from "react";
import {tableCustomizations} from "@/theme/customizations/table.tsx";

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
    const {children, disableCustomTheme, themeComponents} = props;
    const theme = useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'template',
                },
                colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                typography,
                shape,
                components: {
                    ...tableCustomizations,
                    ...inputsCustomizations,
                    ...feedbackCustomizations,
                    ...navigationCustomizations,
                    ...surfacesCustomizations,
                    ...themeComponents,
                },
            });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}