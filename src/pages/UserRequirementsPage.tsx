import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { AppBar, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, Divider, Grid, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { getCookieValue, validarToken } from '../lib/functions';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import { PageTitle } from '../components/ui';

// Requerimientos
export interface IRequirement {
    id: number;
    case_id: number;
    user_id: number;
    user_name: string;
    description: string;
    process_id: number;
    process_name: string;
    process_owner_id: string;
    process_owner_name: string;
    activity_id: number;
    activity_name: string;
    activity_owner_id: number;
    activity_owner_name: string;
    status: string;
    inicio: string;
    vence: string;
    completed_at: string;
    comentario_cierre: string;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserRequirementsPage: FC = () => {

    // Datos del usuario loggeado
    const [userLogged, setUserLogged] = useState<User | null>(null);

    // Mis requerimientos
    const [myRequirements, setMyRequirements] = useState<IRequirement[] | null>(null);

    // Control del modal
    const [open, setOpen] = useState<boolean>(false);

    // Tarea seleccionada
    const [selectedTask, setSelectedTask] = useState<IRequirement | null>(null);

    // Loader
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Enviando formulario
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Loader
    const [respuestaReq, setRespuestaReq] = useState<string>("");


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const ref = useRef<HTMLInputElement>(null)

    /**
     * Funcion para abrir modal
     */
    const handleClickOpen = () => {
        setOpen(true);
    };
    const resetModal = () => {
        setSelectedTask(null);
        setOpen(false);
        setRespuestaReq("")
    }
    /**
     * Funcion para cerrar Modal
     */
    const handleClose = () => {
        setOpen(false);
    };

    // Router
    const router = useNavigate();
    const openModal = (id: number) => {
        const thisReq = myRequirements?.filter(req => Number(req.id) === Number(id))[0];
        setSelectedTask(thisReq ? thisReq : null);
        setOpen(true);
    }
    /**
     * Funcion para obtener los requerimientos
     */
    const validateRole = async () => {
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
            const respuesta = await fetch(urlUser, options);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                if (String(data.usuario.function_id) === "2") {
                    router('/traffic')
                } else {
                    router('/traffic')
                }

            }
        } catch (err) {
            console.log(err);
            // router("/dashboard");
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
                const url = `${baseUrl}/listatareas?owner_id=${userData.id}&status=abierta`;

                try {
                    const respuesta = await fetch(url);
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        setMyRequirements(data.registros);
                        console.log(data.registros)
                    } else {
                        setMyRequirements(null);

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

    const onSubmit = async () => {
        setIsSubmitting(true);
        const url = `${baseUrl}/respuesta`
        const body = new FormData();

        body.append("task_id", String(selectedTask?.id));
        body.append("respuesta", String(respuestaReq));

        const options = {
            method: "POST",
            body
        }

        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                const newRequirements: IRequirement[] | null = myRequirements?.filter(req => req.id !== selectedTask?.id) || null;
                Swal.fire({
                    title: "Exito",
                    text: "Se ha respondido el requerimiento",
                    icon: "success",
                })
                setMyRequirements(newRequirements);
                getMyRequirements();
                resetModal();
                setIsSubmitting(false);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró responder el requerimiento",
                    icon: "error",
                });
                setIsSubmitting(false);
            }
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "No se logró conectar al servidor",
                icon: "error",
            });
            console.log(err);
            setIsSubmitting(false);
        }
    }

    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getMyRequirements();
        validateRole();
        setIsLoading(false);
    }, [])

    // Render
    return (
        <Layout title="Mis tareas" user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <PageTitle title="Tareas abiertas" />

                {isLoading && (
                    <Box sx={{ w: "100%", m: "auto" }}>
                        <CircularProgress color="secondary" />
                    </Box>
                )}
                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={1}>
                    {
                        myRequirements && myRequirements.map(req => (
                            <Grid item key={req.id} xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", w: "100%", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.1)", p: 2, flexWrap: "wrap" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="subtitle1" fontSize={16} fontWeight="400">{req.process_name} #{req.case_id}</Typography>
                                        <Typography variant="subtitle2" fontSize={12} fontWeight="300" color="text.secondary">{req.description}</Typography>
                                    </Box>
                                    <Button color="secondary" onClick={() => openModal(req.id)} sx={{ p: 2 }}>Ver más</Button>
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar sx={{ position: 'relative' }}>
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
                                {selectedTask?.process_name}
                            </Typography>
                            <Button autoFocus color="inherit" onClick={handleClose}>

                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ width: "80%", m: "50px auto" }}>
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Descripcion del requerimiento
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.description}
                        </Typography>
                        <Divider sx={{ mb: 1, mt: 1 }} />
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Actividad
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.activity_name}
                        </Typography>
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Encargado de la actividad
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.activity_owner_name}
                        </Typography>
                        <Divider sx={{ mb: 1, mt: 1 }} />
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Proceso
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.process_name}
                        </Typography>
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Encargado del proceso
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.process_owner_name}
                        </Typography>
                        <Divider sx={{ mb: 1, mt: 1 }} />
                        <Typography variant="body1" component="p" fontWeight="bold">
                            Fecha de vencimiento
                        </Typography>
                        <Typography variant="body1" component="p">
                            {selectedTask?.vence}
                        </Typography>

                        <Button component="a" href={`/briefing/${selectedTask?.case_id}`} target={"_blank"} style={{ borderRadius: 5, boxShadow: "0 8px 32p 0 rgba(100,100,100,0.2)", border: "1px solid black", padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em" }}>Ver Brief</Button>
                        {
                            selectedFile && (
                                <>
                                    <Typography variant="overline">Nombre de archivo</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">{selectedFile.name}</Typography>
                                </>
                            )
                        }
                        <Button type="button" variant="contained" color={selectedFile ? "success" : "info"} fullWidth sx={{
                            textTransform: "none",
                            p: 1.8,
                            borderRadius: 5,
                            marginBlock: 1,
                            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                        }} onClick={() => ref !== null && ref.current?.click()}>{selectedFile ? 'Cambiar archivo' : 'Seleccionar Archivo'}</Button>

                        <input
                            ref={ref as any}
                            type="file"
                            style={{ display: "none" }}
                            accept={"image/*"}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectedFile(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                e.target.value = "";
                            }}
                        />
                        <TextField label="Respuesta de cierre de actividad" fullWidth value={respuestaReq} onChange={(e: ChangeEvent<HTMLInputElement>) => setRespuestaReq(e.currentTarget.value)} multiline color="secondary" variant="outlined" sx={{ mt: 2, mb: 2 }} />
                        <LoadingButton color="secondary" variant="contained" onClick={() => onSubmit()} loading={isSubmitting} fullWidth sx={{ p: 1.8 }}>Responder tarea</LoadingButton>
                    </Box>
                </Dialog>
            </Box>
        </Layout>
    )
}