import { Box, Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, styled, Divider, Tooltip } from '@mui/material';
import { useState, Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CheckIcon from '@mui/icons-material/Check';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabledRounded';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';

type CardProps = {
    subtitleOver: string;
    title: string;
    subtitleBelow: string;
    description: string;
    cambiarRoles: any;
    user: User;
    users: User[];
    rolActual: any;
    statusActual: any;
}
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));



const BasicCard: FC<CardProps> = ({ subtitleOver, title, subtitleBelow, description, cambiarRoles, user, rolActual, statusActual, users }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card variant="outlined" sx={{
            width: "100%", mb: 2, border: "none", borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
            background: "rgba(255,255,255,0.6)",
            backdropFilter: 'blur(6px)',
        }}>
            <CardContent>
                <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                    {subtitleOver}
                </Typography>
                <Typography variant="h6" component="p">
                    {title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} variant="subtitle2" color="text.secondary">
                    {subtitleBelow}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>

            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography fontWeight={"bold"} variant="subtitle1" >Cambiar roles</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                        <Button size="small" color="secondary" onClick={() => cambiarRoles(2, user.status, user, users)} sx={{ p: 1 }}>Cliente</Button>
                        <Button size="small" color="secondary" onClick={() => cambiarRoles(3, user.status, user, users)} sx={{ p: 1 }}>Usuario</Button>
                        <Button size="small" color="secondary" onClick={() => cambiarRoles(99, user.status, user, users)} sx={{ p: 1 }}>Invitado</Button>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography fontWeight={"bold"} variant="subtitle1" >Cambiar Status</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">

                        <Tooltip title="Activar">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} onClick={() => cambiarRoles(user.role_id, "Activo", user, users)}><CheckIcon /></IconButton>
                        </Tooltip >
                        <Tooltip title="Desactivar">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} onClick={() => cambiarRoles(user.role_id, "Inactivo", user, users)}><PersonOffIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Suspender">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} onClick={() => cambiarRoles(user.role_id, "Suspendido", user, users)}><HourglassDisabledIcon /></IconButton>
                        </Tooltip>
                    </Box>

                </CardContent>
            </Collapse>
        </Card>
    );
}


interface Props {
    user: User;
    users: User[];
    setUsers: Dispatch<SetStateAction<User[] | null>>
}
export const UserCard: FC<Props> = ({ user, setUsers, users }) => {
    /**
     * Funcion npara cambiar el rol y el status de un usuario
     * @param rol Rol del usuario
     * @param status Status del usuario
     * @param user Datos del usuario
     */
    const cambiarRoles = async (rol: string, status: string, user: User, users: User[]) => {
        const url = `${baseUrl}/cambiaregistro`;
        const body = new FormData();

        body.append("user_id", String(user.id));
        body.append("role_id", String(rol));
        body.append("status", String(status));
        const options = {
            method: "POST",
            body
        }

        try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {

                const userToAdd = data.registros[0];
                const usersPopped = users.filter((oneUser: any) => oneUser.id !== user.id);
                const newUserArray = [
                    ...usersPopped,
                    userToAdd
                ]
                setUsers(newUserArray);
                const alertaExito = await Swal.fire({
                    title: "Exito",
                    text: "Se modificó la informacion del usuario",
                    icon: "success",
                })

            } else {
                const alertaError = await Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al conectar con  el servidor",
                    icon: "error",
                })

            }
        } catch (error) {
            console.log(error);

            const alertaError = await Swal.fire({
                title: "Error",
                text: "Ocurrió un error al conectar con  el servidor",
                icon: "error",
            })
        }
    }
    return (<>
        <BasicCard subtitleOver={user.role_name} title={user.name} subtitleBelow={user.status} description={user.username} cambiarRoles={cambiarRoles} rolActual={user.role_id} statusActual={user.status} user={user} users={users} />
    </>
    )
}
