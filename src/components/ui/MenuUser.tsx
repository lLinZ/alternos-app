import { FC, useState, MouseEvent } from "react";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu, { MenuProps } from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import { AvatarPlaceholder, UserDataPlaceholder, MenuTextPlaceholder } from "../placeholder";
import { UserData, AdminList, UserList } from "./userMenu";
import { getCookieValue } from "../../lib/functions";
import { User } from "../../interfaces/user-type";

interface Props {
    user: User | null;
}
export const MenuUser: FC<Props> = ({ user }) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    // Token del usuario logeado
    const token = getCookieValue("token");

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const propsAdminList = { handleCloseUserMenu, user };
    const propsUserList = { handleCloseUserMenu, user };

    const menuProps: MenuProps = {
        sx: { mt: '45px' },
        id: "menu-appbar",
        anchorEl: anchorElUser,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        },
        keepMounted: true,
        transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
        },
        open: Boolean(anchorElUser),
        onClose: handleCloseUserMenu,
    }
    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir configuraciones">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {
                        user
                            ? (<Avatar alt={user ? user.name : 'A'} src="/static/images/avatar/2.jpg" sx={{ bgcolor: user ? user.coloravatar : '#bdbdbd' }} />)
                            : (<AvatarPlaceholder />)
                    }
                </IconButton>
            </Tooltip>
            <Menu PaperProps={{ sx: { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.5)' } }} MenuListProps={{ sx: { background: 'rgba(0,0,0,0.0)', overflow: 'hidden', borderRadius: 5 } }} {...menuProps}>
                {
                    token && (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            {
                                user
                                    ? (
                                        <UserData user={user} />
                                    )
                                    : (
                                        <Box sx={{ mb: 1 }}>
                                            <UserDataPlaceholder />
                                        </Box>
                                    )
                            }
                            <Divider />
                        </Box>
                    )
                }
                {token && (
                    user
                        ? (<MenuList sx={{ p: 2 }} dense> {user.role_id === 1 ? (<AdminList {...propsAdminList} />) : (<UserList {...propsUserList} />)} </MenuList>)
                        : (<MenuTextPlaceholder />)
                )
                }
            </Menu>
        </Box>
    )
}
