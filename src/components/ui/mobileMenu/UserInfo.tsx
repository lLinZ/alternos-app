import { FC } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { User } from "../../../interfaces/user-type";

interface Props {
    user: User | null;
}

export const UserInfo: FC<Props> = ({ user }) => {
    return (<>
        <Avatar alt={user ? user.name : 'A'} src="/static/images/avatar/2.jpg" sx={{ bgcolor: user ? user.coloravatar : '#bdbdbd' }} />
        <Typography variant="subtitle1" color="text.primary" fontWeight="bold" fontSize={12}>
            {user ? user.name : ""}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="400" fontSize={12}>
            {user ? user.username : ""}
            {/*user.username*/}
        </Typography>
        <Typography variant="overline" color="text.secondary" fontWeight="bold" fontSize={10}>
            {user ? user.role_name : ""}
            {/*user.role_name*/}
        </Typography>
    </>)
}