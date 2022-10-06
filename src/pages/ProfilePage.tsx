import { FC, useEffect, useState, } from 'react'
import { Divider, Typography, Box, Avatar, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'
import { green } from '@mui/material/colors'
import { ColorPicker, UserInfo, UserEditForm, NewUser } from '../components/profile'



const initialValues: NewUser = {
    name: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
}

export const ProfilePage: FC = () => {

    // Datos del usuario logeado
    const [userLogged, setUserLogged] = useState<User | null>(null)

    // Router
    const router = useNavigate();

    // Color del avatar
    const [color, setColor] = useState<any>(green[500]);

    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    const userEditFormProps = { userLogged, setUserLogged, initialValues };

    // Render
    return (
        <Layout user={userLogged}>
            <Grid container spacing={1} sx={{ width: "90%", margin: "auto", minHeight: "100%" }}>
                <Grid item xs={12} sx={{ borderRadius: 5, background: "#FFF", }} >
                    <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: { xs: "center", sm: "space-evenly", md: "space-between" }, p: 2 }}>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: color, mr: 2 }}>{userLogged?.name.substring(0, 1)}</Avatar>
                            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" >Color del avatar</Typography>
                        </Box>
                        <ColorPicker setColor={setColor} />
                    </Box>
                    <Divider sx={{ marginBlock: 2 }} />
                    <UserInfo userLogged={userLogged} />
                </Grid>
                <Grid item xs={12} >
                    <UserEditForm {...userEditFormProps} />
                </Grid>

            </Grid>
        </Layout>
    )
}
