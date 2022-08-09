import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FFF',
        },
        secondary: {
            main: '#181818'
        },
    },
    typography: {
        allVariants: {
            fontFamily: ['Roboto', 'Helvetica', 'sans-serif'].join(','),
        },
        htmlFontSize: 16,
    },
});