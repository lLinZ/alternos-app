import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { amber, orange, red, pink, purple, blue, green } from '@mui/material/colors'
import { baseUrl } from '../../common/baseUrl'
import Swal from 'sweetalert2'
import { User } from '../../interfaces/user-type'
interface Props {
    setUserLogged: Dispatch<SetStateAction<User | null>>;
    user: User | null;
}
export const ColorPicker: FC<Props> = ({ user, setUserLogged }) => {
    const [changing, setChanging] = useState<boolean>(false);
    const changeColor = async (color: string) => {
        setChanging(true);
        if (user) {
            const body = new FormData();
            body.append("username", String(user.username));
            body.append("coloravatar", String(color));
            const url = `${baseUrl}/perfil`;
            const options = {
                method: "POST",
                body
            }
            const respuesta = await fetch(url, options)
            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                Swal.fire({
                    title: "Se cambió el color del avatar",
                    icon: "success",
                    toast: true,
                    position: "bottom-start",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                })
                setChanging(false);
                const newUser = { ...user, coloravatar: color };
                setUserLogged(newUser);
            } else {
                Swal.fire({
                    title: "No se cambió el color",
                    icon: "error",
                    toast: true,
                    position: "bottom-start"
                })
                setChanging(false);
            }
        } else {
            setChanging(false);
        }
    }

    return (
        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(amber[500])} >
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: amber[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(orange[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: orange[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(red[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: red[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(pink[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: pink[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(purple[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: purple[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(blue[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: blue[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton disabled={changing} onClick={() => changeColor(green[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: green[500] }}></Box>
                </IconButton>
            </Box>
        </Box>
    )
}
