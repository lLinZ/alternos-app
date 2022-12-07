import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import Typography from '@mui/material/Typography';
import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout';
import { User } from '../../interfaces/user-type';
import { validarToken } from '../../lib/functions';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PageTitle } from '../../components/ui';
interface SelectedUser {
    id: number;
    name: string;
    role_name: string;
}
export interface KanbanData {
    user_id: number;
    user_name: string;
    items: Item[];
}

export interface Item {
    id: number;
    pendiente: string;
    enproceso: string;
    completada: string;
}

export const KanbanUser: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const router = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<User[] | null>(null);
    const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }

    const selectUser = (id: number, name: string, role_name: string) => {
        if (!id) {
            setSelectedUser(null);
            setKanbanData(null);
            setOpen(false);
        } else {
            setSelectedUser({ id, name, role_name });
            getData(id);
            setOpen(false);
        }
    }
    const getData = async (id: number) => {
        const url = `${baseUrl}/kanban?user_id=${id}`;

        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setKanbanData(data.registros[0])
                Swal.fire({
                    title: "Exito",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    position: "bottom-start"
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se encontro data",
                    icon: "error"
                })
                setKanbanData(null);

            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Error interno del servidor',
                icon: "error",
            })
            setKanbanData(null);
        }
    }
    const getUsers = async () => {
        const url = `${baseUrl}/listaregistros?role_id=3&status=Activo`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setUsers(data.registros)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getUsers();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Kanban por usuario" />
                <Box sx={styles.selection}>
                    <Button disableElevation fullWidth variant="contained" onClick={handleOpen} color="secondary" sx={styles.button}>Seleccionar usuario</Button>
                </Box>
                {selectedUser && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="overline" fontWeight={"bold"}>Usuario seleccionado</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{selectedUser.name}</Typography>
                            <Typography variant="overline" fontWeight={"bold"}>Rol</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{selectedUser.role_name}</Typography>
                        </Box>
                        <CheckCircleIcon color="success" />
                    </Box>
                )}
                {
                    selectedUser && !kanbanData && (
                        <Box sx={{ p: 5, width: "100%", mt: 2 }}>
                            <Typography color="text.secondary" textAlign={"center"} fontWeight="bold" variant="subtitle2">No hay registros para este usuario</Typography>
                        </Box>
                    )
                }
                {
                    kanbanData && (
                        <Box sx={{ minWidth: "100%", maxWidth: "100%", minHeight: 400, overflowX: "scroll", display: 'flex', justifyContent: "space-between", alignItems: "start" }}>
                            <Box sx={styles.kanbanCategory}>
                                <Box sx={styles.kanbanCategoryTitle}>
                                    <Typography variant="overline" fontWeight={"bold"}>Pendiente</Typography>
                                    <AccessTimeIcon color="warning" />
                                </Box>
                                {
                                    kanbanData && kanbanData.items.map((i: Item) => i.pendiente && (
                                        <Box sx={styles.kanbanDataContainer}>
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.pendiente}</Typography>
                                        </Box>
                                    ))
                                }
                            </Box>
                            <Box sx={styles.kanbanCategory}>
                                <Box sx={styles.kanbanCategoryTitle}>
                                    <Typography variant="overline" fontWeight={"bold"}>En proceso</Typography>
                                    <HourglassBottomRoundedIcon color="info" />
                                </Box>
                                {
                                    kanbanData && kanbanData.items.map((i: Item) => i.enproceso && (
                                        <Box sx={styles.kanbanDataContainer}>
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.enproceso}</Typography>
                                        </Box>
                                    ))
                                }
                            </Box>
                            <Box sx={styles.kanbanCategory}>
                                <Box sx={styles.kanbanCategoryTitle}>
                                    <Typography variant="overline" fontWeight={"bold"}>Completado</Typography>
                                    <CheckCircleIcon color="success" />
                                </Box>
                                {
                                    kanbanData && kanbanData.items.map((i: Item) => i.completada && (
                                        <Box sx={styles.kanbanDataContainer}>
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{i.completada}</Typography>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{
                sx: {
                    background: '#f1f1f1'
                }
            }} >
                <AppBar color="primary" position="static" sx={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }}>
                    <Toolbar >
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Usuario
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={styles.usersContainer}>
                    {
                        users && users.map((u: User) => (
                            <Box key={u.id} sx={styles.userCard}>
                                <Typography variant="body1">{u.name}</Typography>
                                <Button disabled={selectedUser && Number(selectedUser.id) === Number(u.id) ? true : false} color="secondary" variant="contained" sx={styles.button} onClick={() => selectUser(Number(u.id), u.name, u.role_name)}>{selectedUser && Number(selectedUser.id) === Number(u.id) ? "Seleccionado" : "Seleccionar"}</Button>
                            </Box>
                        ))
                    }
                </Box>
            </Dialog>
        </Layout>
    )
}
const styles = {
    mainContainer: {
        minHeight: '100vh',
        width: '80%',
        margin: '20px auto'
    },
    selection: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        p: 1.8,
        borderRadius: 3,
        textTransform: "none"
    },
    usersContainer: {
        width: "80%",
        margin: "20px auto"
    },
    userCard: {
        borderRadius: 5,
        marginBlock: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
        background: "#FFF",
        p: 2
    },
    kanbanDataContainer: {
        borderRadius: 5,
        p: 2,
        mb: 1,
        background: "#efefef",
    },
    kanbanCategory: {
        background: "#FFF",
        minWidth: 250,
        minHeight: 500,
        m: 2,
        p: 2,
        borderRadius: 5,
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
    },
    kanbanCategoryTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly"
    }
}