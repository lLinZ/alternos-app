import { FC, useState, useEffect, ChangeEvent } from 'react'

import { Alert, Box, Collapse, Grid, IconButton, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import CancelIcon from '@mui/icons-material/Cancel';

import { Layout } from '../components/layout'
import { ProcessesModal } from '../components/requirements/ProcessesModal';

import { validarToken } from '../lib/functions';

import { baseUrl } from '../common/baseUrl';

import { User } from '../interfaces/user-type';


import { ISelectedProcess } from '../interfaces/process-type';

// Functional Component
export const RequirementsPage: FC = () => {
    // Datos de usuario
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [selectedProcess, setSelectedProcess] = useState<ISelectedProcess | null>(null);
    const [open, setOpen] = useState<boolean>(true);
    // Router
    const router = useNavigate();

    console.log(userLogged);
    useEffect(() => {
        validarToken(router, setUserLogged);
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
                    resetForm();
                    setIsSubmitting(false);
                } else {
                    Swal.fire({ title: "Error", text: "No se logró enviar el requerimiento", icon: "error" })
                }
            } catch (error) {
                console.log(error);
                Swal.fire({ title: "Error", text: "No se logró conectar con el servidor", icon: "error" })
                setIsSubmitting(false);
            }
        }
    }

    // Render
    return (
        <Layout user={userLogged} title="Requerimientos" >
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>

                <Typography variant="overline" component="h2" fontWeight="bold" fontSize={16}>Registrar requerimiento
                    {!open && (<IconButton onClick={() => setOpen(prev => !prev)} sx={{ transition: ".5s ease all" }}>
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
                            En esta interfaz podrás describir tu requerimiento con una descripción específica, seleccionar un proceso y enviarlo para nosotros revisarlo y solucionar tus necesidades lo más pronto posible!
                        </Alert>
                    </Collapse>
                </Box>

                <Grid container display="flex" justifyContent="start" alignItems="start" spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Descripcion" name="description" value={description} onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.currentTarget.value)} variant="outlined" color="secondary" multiline />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProcessesModal selectedProcess={selectedProcess} setSelectedProcess={setSelectedProcess} />
                    </Grid>
                    {
                        selectedProcess && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-evenly ", alignItems: "center" }}>
                                    <Box>
                                        <Typography variant="body1" fontWeight={"bold"}>Proceso seleccionado</Typography>
                                        <Typography variant="subtitle1" color="text.secondary">{selectedProcess.name}</Typography>
                                    </Box>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12}>
                        <LoadingButton sx={{ p: 1.8 }} loading={isSubmitting} fullWidth color="secondary" variant="contained" onClick={() => onSubmit()}>Enviar</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
