import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        allVariants: {
            fontFamily: ['Roboto', 'Helvetica', 'sans-serif'].join(','),
        },
        htmlFontSize: 16,
    },
});