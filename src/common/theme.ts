import { createTheme } from "@mui/material/styles";
import { baseUrl } from "./baseUrl";

export const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F4F4F4'
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
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#f4f4f4",
                    backgroundImage: `linear-gradient(90deg, rgba(250,250,250,1) 0%, rgba(241,241,241,1) 100%);`,
                },
            },
        },
    }
});