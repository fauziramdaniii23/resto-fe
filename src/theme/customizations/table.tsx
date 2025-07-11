import type {Components, Theme} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {gray} from "@/theme/themePrimitives.ts";

export const tableCustomizations: Components<Theme> = {
    MuiTable: {
        styleOverrides: {
            root: ({theme}) => ({
                borderCollapse: 'separate',
                borderSpacing: 0,
                backgroundColor: theme.palette.background.paper,
                ...theme.applyStyles('dark', {
                    backgroundColor: 'oklch(12.9% 0.042 264.695)',
                }),
            }),
        },
    },
    MuiTableHead: {
        styleOverrides: {
            root: ({theme}) => ({
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
            }),
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: ({theme}) => ({
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                padding: theme.spacing(1.5),
                fontSize: 14,
            }),
            head: ({theme}) => ({
                zIndex: 99,
                fontWeight: 600,
                color: gray[800],
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
                backdropFilter: 'blur(8px)',
                ...theme.applyStyles('dark', {
                    color: 'hsl(0, 0%, 100%)',
                }),
            }),
            body: ({theme}) => ({
                color: gray[800],
                ...theme.applyStyles('dark', {
                    color: 'hsl(0, 0%, 100%)',
                }),
            }),
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: ({theme}) => ({
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                },
            }),
        },
    },
}