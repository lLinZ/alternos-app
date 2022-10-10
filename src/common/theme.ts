import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F2F2F2'
        },
        primary: {
            main: '#FFF',
        },
        secondary: {
            main: '#101010'
        },
    },
    typography: {
        allVariants: {
            fontFamily: ['Roboto', 'Helvetica', 'sans-serif'].join(','),
        },
        htmlFontSize: 16,
    },
});