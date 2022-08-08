import * as React from "react";
import { Box } from "@mui/material";
import { AppBarComponent } from "../ui/AppBarComponent";

type Props = {
    title?: string;
    children: React.ReactNode,
}
export const Layout: React.FC<Props> = ({ title = "Alternos App", children }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <AppBarComponent title={title} />
            <Box sx={{ width: "80%", margin: "20px auto" }}>
                {children}
            </Box>
        </Box>
    )
}
