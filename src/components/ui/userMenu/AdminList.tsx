import { FC } from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "../../../interfaces/settings-type";
import { adminSettings } from "../settings";

interface Props {
    handleCloseUserMenu: () => void;
}
export const AdminList: FC<Props> = ({ handleCloseUserMenu }) => {
    const currentPath = useLocation();
    return (
        <>
            {
                adminSettings.map((setting: Settings, i: number) => (String(currentPath.pathname) !== String(setting.path) ?
                    (<Link style={{ textDecoration: 'none' }} key={`${i + 2}${setting.name}${i}`} to={setting.path}>
                        <MenuItem onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" fontSize={12} sx={{ color: "text.primary" }}>{setting.name}</Typography>
                        </MenuItem>
                    </Link>) : (
                        <MenuItem sx={{
                            transition: "0.5s ease all",
                            background: "rgba(0,0,0,0.9)", textDecoration: "none", "&:hover": {
                                background: "rgba(0,0,0,0.7)"
                            }
                        }} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" fontSize={12} sx={{ color: "#FFF" }}>{setting.name}</Typography>
                        </MenuItem>
                    )
                ))}
        </>
    )
}