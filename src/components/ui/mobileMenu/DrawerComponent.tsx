import { FC, MouseEvent, KeyboardEvent } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
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
        <Drawer anchor="left" BackdropProps={{ sx: { background: 'rgba(255,255,255,0.0)' } }} open={state} onClose={toggleDrawer(false)} PaperProps={{ sx: { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(6px)', } }}  >
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1.2, md: 1.8 }, background: "rgba(0,0,0,1)", }}>
                <img src='/logo.png' width='120' height='35' />
            </Box>
            <Box sx={{ p: 1, display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "column wrap", }}>

                {
                    user
                        ? (<UserInfo user={user} />)
                        : (<UserPlaceholder />)
                }
            </Box>
            <Box
                sx={{ width: 250, p: 2, minHeight: '100vh', maxHeight: '100%', overflowY: 'show' }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                {token && user && String(user?.role_name) === "Administrador" && (<AdminList user={user} />)}
                {token && user && String(user?.role_name) !== "Administrador" && (<UserList user={user} />)}
            </Box>
        </Drawer>
    )
}