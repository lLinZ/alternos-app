import { FC, MouseEvent, KeyboardEvent } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { UserPlaceholder } from "../../placeholder";
import { UserInfo } from "./UserInfo";
import { User } from "../../../interfaces/user-type";
import { UserList, AdminList } from ".";
import { getCookieValue } from "../../../lib/functions";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
    user: User | null;
    state: boolean;
    toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
}
export const DrawerComponent: FC<Props> = ({ user, state, toggleDrawer }) => {
    const token = getCookieValue('token');
    const router = useNavigate();
    const currentPath = useLocation();
    const redirect = (path: string) => {
        router(path);
    }
    return (
        <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 0.6, md: 1 }, background: "rgba(0,0,0,1)", mb: 1 }}>
                <img src='/logo.png' width='171' height='49' />
            </Box>
            <Box sx={{ p: 1, display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "column wrap" }}>

                {
                    user
                        ? (<UserInfo user={user} />)
                        : (<UserPlaceholder />)
                }
            </Box>
            <Divider />
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                {token && user && String(user?.role_name) === "Administrador" && (<AdminList />)}
                {token && user && String(user?.role_name) !== "Administrador" && (<UserList />)}
            </Box>
        </Drawer>
    )
}