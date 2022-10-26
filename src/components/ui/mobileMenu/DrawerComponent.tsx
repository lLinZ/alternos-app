import { FC, MouseEvent, KeyboardEvent } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { List } from "react-content-loader";
import { UserPlaceholder, MenuTextPlaceholder } from "../../placeholder";
import { UserInfo } from "./UserInfo";
import { User } from "../../../interfaces/user-type";
import { UserList, AdminList } from ".";
import { Pages } from "../../../interfaces/pages-type";

interface Props {
    user: User | null;
    state: boolean;
    toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
    pages: Pages[];
    adminPages: Pages[];
}
export const DrawerComponent: FC<Props> = ({ user, state, toggleDrawer, pages, adminPages }) => {
    console.log(user)
    return (
        <Drawer anchor="left" open={true} onClose={toggleDrawer(false)}>
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
            <Typography sx={{ ml: 2, mb: -1 }} variant="overline" fontWeight="bold">Opciones</Typography>
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    {
                        user
                            ? String(user.role_name) === "Administrador"
                                ? (<AdminList adminPages={adminPages} />)
                                : (<UserList pages={pages} />)
                            : (<MenuTextPlaceholder />)
                    }
                </List>
            </Box>
        </Drawer>
    )
}