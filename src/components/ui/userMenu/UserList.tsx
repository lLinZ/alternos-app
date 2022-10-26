import { FC } from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "../../../interfaces/settings-type";
import { settings } from "../settings";

interface Props {
    handleCloseUserMenu: () => void;
}
export const UserList: FC<Props> = ({ handleCloseUserMenu }) => {
    const currentPath = useLocation();
    return (
        <>
            {settings.map((setting: Settings, i: number) => (String(currentPath.pathname) !== String(setting.path) &&
                (<Link style={{ textDecoration: 'none' }} key={`${i + 2}${setting.name}${i}`} to={setting.path}>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" fontSize={12} sx={{ color: "text.primary" }}>{setting.name}</Typography>
                    </MenuItem>
                </Link>)))}
        </>
    )
}