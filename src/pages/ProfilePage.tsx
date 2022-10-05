import { FC, useEffect, useState, ReactNode } from 'react'
import { Divider, Typography, Box, Avatar, IconButton, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'
import { red, blue, green, pink, purple, amber, orange } from '@mui/material/colors'
import CircleIcon from '@mui/icons-material/Circle';


interface PropsCaracteristica {
    title: string;
    children?: ReactNode;
}
const Caracteristica: FC<PropsCaracteristica> = ({ title, children }) => (

    <Box sx={{ display: "flex", flexFlow: "row", alignItems: "center" }}>
        <CircleIcon sx={{ fontSize: 12, mr: 2 }} color="success" />
        <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mr: 1, fontSize: 16 }}>{title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{children}</Typography>
    </Box>)

export const ProfilePage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();

    const [color, setColor] = useState<any>(green[500]);
    console.log(green[500])
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    return (
        <Layout user={userLogged}>
            <Grid container spacing={1} sx={{ width: "90%", margin: "auto", minHeight: "100vh", borderRadius: 5, p: 1, background: "#FFF" }}>
                <Grid item xs={12} >
                    <Box>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
                            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mr: 1 }}>Color del avatar</Typography>
                            <Avatar sx={{ bgcolor: color }}>{userLogged?.name.substring(0, 1)}</Avatar>
                        </Box>
                        <Box sx={{ display: "flex", }}>
                            <IconButton onClick={() => setColor(amber[500])} >
                                <Box sx={{ width: 10, height: 10, bgcolor: amber[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(orange[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: orange[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(red[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: red[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(pink[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: pink[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(purple[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: purple[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(blue[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: blue[500] }}></Box>
                            </IconButton>

                            <IconButton onClick={() => setColor(green[500])}>
                                <Box sx={{ width: 10, height: 10, bgcolor: green[500] }}></Box>
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider sx={{ marginBlock: 2 }} />

                    <Box>
                        <Caracteristica title="Nombre">{userLogged?.name}</Caracteristica>
                        <Caracteristica title="Correo">{userLogged?.username}</Caracteristica>
                        <Caracteristica title="Telefono">{userLogged?.phone}</Caracteristica>
                        <Caracteristica title="Rol">{userLogged?.role_name}</Caracteristica>
                        <Caracteristica title="Departamento">{userLogged?.function_id}</Caracteristica>
                    </Box>
                </Grid>
                <Grid item xs={12}>

                </Grid>


            </Grid>
        </Layout>
    )
}
