import { createTheme } from "@mui/material/styles";
import { baseUrl } from "./baseUrl";

export const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ecf0f3'
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
            fontFamily: ['Montserrat', 'sans-serif'].join(','),
        },
        htmlFontSize: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#ecf0f3",
                    backgroundImage: `linear-gradient(90deg, rgba(250,250,250,1) 0%, rgba(235,236,235,1) 100%);`,
                },
            },
        },
    }
});

// fontFamily: ['Roboto', 'Helvetica', 'sans-serif'].join(','),
