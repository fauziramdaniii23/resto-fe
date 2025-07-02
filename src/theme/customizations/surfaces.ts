import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material';
import { gray } from '../themePrimitives';

export const surfacesCustomizations: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 4,
        overflow: 'clip',
        backgroundColor: (theme.vars || theme).palette.background.default,
        border: 'none',
        borderColor: (theme.vars || theme).palette.divider,
        ':before': {
          backgroundColor: 'transparent',
        },
        '&:not(:last-of-type)': {
          borderBottom: 'none',
        },
        '&:first-of-type': {
          borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        },
        '&:last-of-type': {
          borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        borderRadius: 8,
        '&:hover': { backgroundColor: gray[50] },
        '&:focus-visible': { backgroundColor: 'transparent' },
        ...theme.applyStyles('dark', {
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1), },
        }),
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { mb: 20, border: 'none' },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          padding: 16,
          gap: 16,
          transition: 'all 100ms ease',
          backgroundColor: gray[50],
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          boxShadow: 'none',
          ...theme.applyStyles('dark', {
            backgroundColor: gray[800],
          }),
          variants: [
            {
              props: {
                variant: 'outlined',
              },
              style: {
                border: `1px solid ${(theme.vars || theme).palette.divider}`,
                boxShadow: 'none',
                background: 'hsl(0, 0%, 100%)',
                ...theme.applyStyles('dark', {
                  background: alpha(gray[900], 0.4),
                }),
              },
            },
          ],
        };
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': { paddingBottom: 0 },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'transparent',
        padding: 0,
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)', // opsional: hover transparan ringan
        },
      }),
    },
  },
  MuiListItemButton: {
      styleOverrides: {
          root: ({theme}) => ({
              borderRadius: 8,
            marginRight: 8,
            marginLeft: 8,
              '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1), // opsional efek hover ringan
              },
              '&.Mui-selected': {

              },
          }),
      },
  },
  MuiListItemIcon:{
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 40,
        color: (theme.vars || theme).palette.text.secondary,
        '&.Mui-selected': {
          color: (theme.vars || theme).palette.primary.main,
        },
      }),
    },
  }
};