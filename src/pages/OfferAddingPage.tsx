import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { baseUrl } from '../common/baseUrl'

const UserSelectionDialog = () => {

    const [open, setOpen] = useState<boolean>(false)
    const [users, setUsers] = useState<User[] | null>(null)

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const getUsers = async () => {
        const url = `${baseUrl}/listaregistros?role_id=2`
        try {
            const respuesta = await fetch(url)

            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json()
                    setUsers(data.registros)
                    break;
                default:
                    break;
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const localStyles = {
        button: {
            borderRadius: 5,
            p: 1.9,
            textTransform: 'none'
        },
        mainContainer: {
            width: '80%',
            margin: '20px auto'
        },
        userBox: {
            borderRadius: 5,
            background: "#FFF"
        }
    }
    return (
        <>
            <Button onClick={handleOpen} variant={'contained'} fullWidth color={'secondary'} sx={localStyles.button}>Seleccionar usuario</Button>
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{ sx: { background: "#f6f6f6" } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar usuario
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={localStyles.mainContainer}>
                    {
                        users && users?.map((u: User) => (
                            <>
                                <Box sx={localStyles.userBox}>

                                    <Typography>{u.name}</Typography>
                                </Box>
                            </>
                        ))
                    }
                </Box>
            </Dialog>
        </>
    )
}

export const OfferAddingPage: FC = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null)

    const router = useNavigate();

    useEffect(() => {
        validarToken(router, setUserLogged)
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <UserSelectionDialog />


            </Box>

        </Layout>
    )
}
const styles = {
    mainContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh",
    },
}