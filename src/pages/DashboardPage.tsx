import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { Alert, Box, Collapse, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material'

import { LoadingButton } from '@mui/lab'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'

import { baseUrl } from '../common/baseUrl'
import { WidgetList } from '../components/dashboard'
import { Layout } from '../components/layout'
import { ProcessesModal } from '../components/requirements/ProcessesModal'

import { getCookieValue, validarToken } from '../lib/functions'
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { ISelectedProcess } from '../interfaces/process-type'
import { User } from '../interfaces/user-type'
import { IRequirement } from './UserRequirementsPage'

const widgets = [
    {
        id: 1,
        name: "Widget 1"
    },
    {
        id: 2,
        name: "Widget 2"
    },
    {
        id: 3,
        name: "Widget 3"
    },
    {
        id: 4,
        name: "Widget 4"
    },
    {
        id: 5,
        name: "Widget 5"
    },
    {
        id: 6,
        name: "Widget 6"
    },
]
export const DashboardPage: FC = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [widgetsS, setWidgets] = useState();
    const [selectedProcess, setSelectedProcess] = useState<ISelectedProcess | null>(null);
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Mis requerimientos
    const [myRequirements, setMyRequirements] = useState<IRequirement[] | null>(null);

    const theme = useTheme();
    const router = useNavigate();

    useEffect(() => {
        validarToken(router, setUserLogged, setWidgets);
        getMyRequirements();
    }, []);

    const resetForm = () => {
        setDescription("");
        setSelectedProcess(null);
    }
    const onSubmit = async () => {
        setIsSubmitting(true);
        const url = `${baseUrl}/requerimiento`;
        let errores = [];

        if (!userLogged || !userLogged.id) {
            errores.push("El id del usuario logeado es obligatorio");
        }
        if (!selectedProcess || !selectedProcess.id) {
            errores.push("El id del proceso es obligatorio");
        }
        if (!description) {
            errores.push("La descripcion es obligatoria");
        }
        if (errores.length > 0) {
            Swal.fire({
                title: "Error",
                html: errores.map(error => `- ${error} </br>`),
                icon: "error"
            })
            setIsSubmitting(false);
        } else {
            const body = new FormData();
            body.append("user_id", String(userLogged ? userLogged.id : ''));
            body.append("process_id", String(selectedProcess ? selectedProcess.id : ''));
            body.append("description", String(description));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();

                if (data.exito === "SI") {
                    Swal.fire({ title: "Exito", text: "Se ha enviado el requerimiento", icon: "success" })
                    setIsSubmitting(false);
                } else {
                    Swal.fire({ title: "Error", text: "No se logró enviar el requerimiento", icon: "error" })
                    resetForm();
                    setIsSubmitting(false);
                }
            } catch (error) {
                console.log(error);
                Swal.fire({ title: "Error", text: "No se logró conectar con el servidor", icon: "error" })
                setIsSubmitting(false);
            }
        }
    }
    const getMyRequirements = async () => {
        const token = getCookieValue("token");
        const username = getCookieValue("username");
        const urlUser = `${baseUrl}/validToken`;
        const body = new FormData();
        body.append("token", token);
        body.append("username", username);
        const options = {
            method: "POST",
            body
        }
        try {
            const userResponse = await fetch(urlUser, options)
            const userDataArray = await userResponse.json();
            if (userDataArray.exito === "SI") {

                const userData = userDataArray.usuario;
                const url = `${baseUrl}/listacasos`;
                try {
                    const respuesta = await fetch(url);
                    const data = await respuesta.json();
                    console.log(data)
                    const filtrado: IRequirement[] = data.registros.filter((tarea: IRequirement) => Number(tarea.process_owner_id) === Number(userLogged?.id));
                    if (data.exito === "SI") {
                        setMyRequirements(filtrado);
                        console.log({ filtrado })
                    } else {
                        console.log("Ocurrio un error al solicitar la informacion de las tareas");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log({ userDataArray })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title="Dashboard" user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="center" spacing={1} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} md={4}>

                        <Box display="flex" flexDirection="column" sx={{
                            background: theme.palette.secondary.main, borderRadius: "10px", cursor: "pointer", transition: ".3s ease all", "&:hover": {
                                boxShadow: "0 0 8px rgb(0,0,0)"
                            }
                        }}>
                            <Box id="title" sx={{ background: theme.palette.secondary.dark, p: 1, borderRadius: "10px 10px 0 0" }}>
                                <Typography variant="subtitle1" sx={{ color: "#FFF" }}>Requerimientos</Typography>
                            </Box>
                            <Box id="content" sx={{ p: 2, color: "#FFF", minHeight: "200px" }}>
                                <Typography variant="overline" component="h2" fontWeight="bold" fontSize={16}>Registrar requerimiento
                                    {!open && (<IconButton onClick={() => setOpen(prev => !prev)} sx={{ transition: ".5s ease all" }} color="primary">
                                        <HelpIcon />
                                    </IconButton>
                                    )
                                    }
                                </Typography>
                                <Box sx={{ w: "100%" }}>
                                    <Collapse in={open} sx={{ transition: ".5s ease all" }}>
                                        <Alert variant="filled" severity="info" sx={{ mb: 2 }} action={<IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                        }>
                                            En este widget podrás describir tu requerimiento con una descripción específica, seleccionar un proceso y enviarlo para nosotros revisarlo y solucionar tus necesidades lo más pronto posible!
                                        </Alert>
                                    </Collapse>
                                </Box>

                                <Grid container display="flex" justifyContent="start" alignItems="start" spacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Descripcion"
                                            name="description"
                                            value={description}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.currentTarget.value)}
                                            variant="outlined"
                                            color="primary"
                                            multiline
                                            focused
                                            sx={{ color: "primary" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ProcessesModal buttonColor="primary" setSelectedProcess={setSelectedProcess} />
                                    </Grid>
                                    {
                                        selectedProcess && (
                                            <Grid item xs={12}>
                                                <Box sx={{ display: "flex", justifyContent: "space-evenly ", alignItems: "center" }}>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={"bold"}>Proceso seleccionado</Typography>
                                                        <Typography variant="subtitle1" color="text.white">{selectedProcess.name}</Typography>
                                                    </Box>
                                                    <CheckCircleIcon color="success" />
                                                </Box>
                                            </Grid>
                                        )
                                    }
                                    <Grid item xs={12}>
                                        <LoadingButton sx={{ p: 1.8 }} loading={isSubmitting} fullWidth color="primary" variant="contained" onClick={() => onSubmit()}>Enviar</LoadingButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box display="flex" flexDirection="column" sx={{
                            background: theme.palette.secondary.main, borderRadius: "10px", cursor: "pointer", transition: ".3s ease all", "&:hover": {
                                boxShadow: "0 0 8px rgb(0,0,0)"
                            }
                        }}
                            onClick={() => router("/requirements")}
                        >
                            <Box id="title" sx={{ background: theme.palette.secondary.dark, p: 1, borderRadius: "10px 10px 0 0" }}>
                                <Typography variant="subtitle1" sx={{ color: "#FFF" }}>Lista de tareas</Typography>
                            </Box>
                            <Box id="content" sx={{ p: 2, color: "#FFF", minHeight: "200px" }}>
                                {myRequirements ? myRequirements.map(req => (
                                    <Box key={req.id} sx={{ border: "1px solid white", borderRadius: "8px" }}>
                                        <Typography variant="subtitle1" color="text.white" >{req.process_name}</Typography>
                                    </Box>
                                ))
                                    : <Typography variant="subtitle1" color="text.white"> No tienes tareas asignadas</Typography>
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <WidgetList widgets={widgetsS} />
            </Box>
        </Layout >
    )
}
