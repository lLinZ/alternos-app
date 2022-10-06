import { FC, useEffect, useState, ReactNode } from 'react'
import { Divider, Typography, Box, Avatar, IconButton, Grid, TextField, Button } from '@mui/material'
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
        <CircleIcon sx={{ fontSize: 12, mr: 2, color: "#f5f5f5" }} />
        <Typography variant="subtitle1" color="text.primary" fontWeight="bold" sx={{ mr: 1, fontSize: 16 }}>{title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{children}</Typography>
    </Box>)

export const ProfilePage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [newUserData, setNewUserData] = useState<User | null>(null)
    const [color, setColor] = useState<any>(green[500]);
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    return (
        <Layout user={userLogged}>
            <Grid container spacing={1} sx={{ width: "90%", margin: "auto", minHeight: "100%" }}>
                <Grid item xs={12} sx={{ borderRadius: 5, background: "#FFF", }} >
                    <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: { xs: "center", sm: "space-evenly", md: "space-between" }, p: 2 }}>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: color, mr: 2 }}>{userLogged?.name.substring(0, 1)}</Avatar>
                            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" >Color del avatar</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
                            <Box>
                                <IconButton onClick={() => setColor(amber[500])} >
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: amber[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(orange[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: orange[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(red[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: red[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(pink[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: pink[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(purple[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: purple[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(blue[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: blue[500] }}></Box>
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setColor(green[500])}>
                                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: green[500] }}></Box>
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                    <Divider sx={{ marginBlock: 2 }} />

                    <Box sx={{ p: 2, mb: 2 }}>
                        <Typography variant="overline" fontWeight="bold">Tu información de usuario</Typography>
                        <Caracteristica title="Nombre">{userLogged?.name}</Caracteristica>
                        <Caracteristica title="Correo">{userLogged?.username}</Caracteristica>
                        <Caracteristica title="Telefono">{userLogged?.phone}</Caracteristica>
                        <Caracteristica title="Rol">{userLogged?.role_name}</Caracteristica>
                        <Caracteristica title="Departamento">{userLogged?.function_id}</Caracteristica>
                    </Box>
                </Grid>
                <Grid item xs={12} >
                    <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: { xs: "center", sm: "space-evenly", md: "space-between" }, mt: 2 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="overline" fontWeight="bold">Editar informacion de usuario</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField color="secondary" sx={{ background: "#FFF", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Nombre" fullWidth value={newUserData?.name} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField color="secondary" sx={{ background: "#FFF", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Teléfono" fullWidth value={newUserData?.name} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField color="secondary" sx={{ background: "#FFF", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Username" fullWidth value={newUserData?.name} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField color="secondary" sx={{ background: "#FFF", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Contraseña" fullWidth value={newUserData?.name} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField color="secondary" sx={{ background: "#FFF", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Confirmar contraseña" fullWidth value={newUserData?.name} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth disableElevation variant="contained" color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }}>Editar información</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12}>

                </Grid>


            </Grid>
        </Layout>
    )
}
