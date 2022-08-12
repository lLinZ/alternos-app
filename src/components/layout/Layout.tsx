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
        <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBarComponent title={title} />
            <Box sx={{ width: "80%", margin: "40px auto", flexGrow: 1, }}>
                {children}
            </Box>
            {footer && (
                <Box sx={{ background: "#101010", height: "200px", width: "100%", p: 5, mt: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="overline" sx={{ color: "#FFF" }}>La creatividad está por todas partes</Typography>
                        <Typography sx={{
                            color: "#FFF", fontFamily: "Bebas Neue", fontSize: "2em",
                        }}>¡NO LO <span style={{ color: "#101010", textShadow: "-1px -1px 0 #FFF,0   -1px 0 #FFF,1px -1px 0 #FFF,1px  0   0 #FFF,1px  1px 0 #FFF,0    1px 0 #FFF,-1px  1px 0 #FFF,-1px  0   0 #FFF" }}>DUDES,</span> HABLA CON NOSOTROS!</Typography>
                        <Button sx={{ mt: 2, p: 2, fontSize: "0.6em" }} color="primary" variant="outlined">Estemos en contacto</Button>
                    </Box>
                </Box>

            )}
        </Box>
    )
}
