import { FC } from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "../../../interfaces/settings-type";
import { adminSettings } from "../settings";
import { User } from "../../../interfaces/user-type";

interface Props {
    handleCloseUserMenu: () => void;
    user: User | null;
}
export const AdminList: FC<Props> = ({ handleCloseUserMenu, user }) => {
    const currentPath = useLocation();
    return (
        <>
            {
                adminSettings.map((setting: Settings, i: number) => (String(currentPath.pathname) !== String(setting.path) ?
                    (<Link style={{ textDecoration: 'none' }} key={`${i + 2}${setting.name}${i}`} to={setting.path}>
                        <MenuItem sx={{ borderRadius: 3, }} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" fontSize={12} sx={{ color: "text.primary" }}>{setting.name}</Typography>
                        </MenuItem>
                    </Link>) : (
                        <MenuItem sx={{
                            transition: "0.5s ease all",
                            borderRadius: 3,
                            background: user ? user.coloravatar : 'primary', textDecoration: "none", "&:hover": {
                                background: "rgba(0,0,0,0.2)"
                            }
                        }} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" fontSize={12} fontWeight={'bold'} sx={{ color: "#FFF" }}>{setting.name}</Typography>
                        </MenuItem>
                    )
                ))}
        </>
    )
}