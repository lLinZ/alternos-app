import * as React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { AppBarComponent } from "../ui/AppBarComponent";

type Props = {
    title?: string;
    footer?: boolean;
    children: React.ReactNode,
}
export const Layout: React.FC<Props> = ({ title = "ALTERNOS", children, footer = true }) => {
    const theme = useTheme();
    return (
        <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
            <AppBarComponent title={title} />
            <Box sx={{ width: "80%", margin: "20px auto" }}>
                {children}
            </Box>
            {footer && (
                <Box sx={{ background: "#181818", position: "absolute", bottom: 0, left: 0, height: "250px", width: "100%", p: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: "#FFF" }}>La creatividad está por todas partes</Typography>
                        <Typography sx={{ color: "#FFF" }}>¡NO LO DUDES, HABLA CON NOSOTROS!</Typography>
                        <Button sx={{ mt: 2, }} color="primary" variant="outlined">Estemos en contacto</Button>
                    </Box>
                </Box>

            )}
        </Box>
    )
}
