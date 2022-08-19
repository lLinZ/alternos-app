import { FC, useEffect, useState, forwardRef, ReactElement, Ref } from "react";

import { AppBar, Box, Button, Dialog, Grid, IconButton, Slide, TextField, Toolbar, Typography } from "@mui/material";

import { Layout } from "../components/layout"
import { validarToken } from "../lib/functions";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../common/baseUrl";
import { LoadingButton } from "@mui/lab";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from "sweetalert2";

interface Props { }

interface SelectedUser {
    id: number;
    name: string;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ProcessesPage: FC<Props> = () => {

    // Usuario logeado
    const [userLogged, setUserLogged] = useState();

    // Abrir modal
    const [open, setOpen] = useState(false);

    // Usuarios registrados
    const [users, setUsers] = useState([]);

    // Usuario seleccionado
    const [userSelected, setUserSelected] = useState<SelectedUser | null>(null);

    // Procesos
    const [process, setProcess] = useState<string>("");

    // Control Enviando formulario
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Router
    const router = useNavigate();


    const onSubmit = async () => {
        setIsSubmitting(true);
        if (!process || !userSelected) {
            Swal.fire({
                title: "Error",
                text: "Faltan campos",
                icon: "error",
            })
            setIsSubmitting(false);
        } else {

            const url = `${baseUrl}/procesos`;

            const body = new FormData();

            body.append("name", process);
            body.append("owner_id", String(userSelected.id));

            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                console.log(respuesta);
                const data = await respuesta.json();

                if (data.exito === "SI") {
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha registrado un proceso nuevo",
                        icon: "success",
                    })
                    setUserSelected(null);
                    setProcess("");
                    setIsSubmitting(false);
                } else {

                    setIsSubmitting(false);
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: "No se logró conectar con el servidor",
                    icon: "error",
                })
                setIsSubmitting(false);
            }
        }
    }
    /**
     * Funcion para obtener usuarios
     */
    const getUsers = async () => {
        const url = `${baseUrl}/listaregistros?role_id=2&status=Activo`
        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                setUsers(data.registros)
            } else {
                setUsers([]);
                console.log("No se logro encontrar ningún usuario")
            }
        } catch (error) {
            console.log(error);
        }
    }



    /**
     * Funcion para seleccionar un usuario
     * @param id ID del usaurio seleccionado
     * @param name Nombre del usuario seleccionado
     */
    const selectUser = (id: number, name: string) => {
        setUserSelected({
            id,
            name
        })
        setOpen(false);
    }

    console.log(userSelected);

    /**
     * Funcion para abrir modal
     */
    const openModal = () => {
        setOpen(true);
    }


    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getUsers();
        // getInformation();
    }, []);

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                <Grid container display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flexDirection="row" spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Nombre" name="name" color="secondary" onChange={(e) => setProcess(e.target.value)} value={process} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button onClick={() => openModal()} color="secondary" fullWidth variant="outlined" sx={{ p: 1.8 }} type="button">Buscar usuario</Button>
                    </Grid>
                    {
                        userSelected && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography>{userSelected.name}</Typography>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <LoadingButton fullWidth loading={isSubmitting} color="secondary" onClick={() => onSubmit()}>Enviar</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
            <Dialog onClose={() => setOpen(false)} open={open} fullScreen TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar usuario
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {users && users.map((usuario: { id: number; name: string; }) => (
                        <Box key={usuario.id} sx={{ p: 2, borderRadius: "10px", border: "1px solid black", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Typography>{usuario.name}</Typography>
                            <Button color="secondary" onClick={() => selectUser(usuario.id, usuario.name)}>Seleccionar</Button>
                        </Box>))}
                </Box>
            </Dialog>
        </Layout>
    )
}