import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#E3E3E3'
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