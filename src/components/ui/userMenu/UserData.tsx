import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { User } from "../../../interfaces/user-type";

interface Props {
    user: User | null;
}
export const UserData: FC<Props> = ({ user }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold">{user?.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="400" >{user?.username}</Typography>
            <Typography variant="overline" color="text.secondary" fontWeight="400">{user?.role_name}</Typography>
        </Box>
    )
}