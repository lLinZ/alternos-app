import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { validarToken } from '../lib/functions';
import { User } from '../interfaces/user-type';
import { Formik, Form, FormikValues, FormikState } from 'formik';
import { baseUrl } from '../common/baseUrl';

import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';

import CheckCircle from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/CloseRounded';
import Circle from '@mui/icons-material/CircleOutlined';
import { ClientRequest } from 'http';

interface BrandCenterInfo {
    etiquetas: string;
    nombre: string;
    ruta: string;
    archivo: string;
}

const initialValues: BrandCenterInfo = {
    etiquetas: '',
    nombre: '',
    ruta: '',
    archivo: '',
}

export const BrandCenterAddingPage: FC = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [clients, setClients] = useState<User[] | null>(null);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    const router = useNavigate()

    useEffect(() => {
        validarToken(router, setUserLogged)
        getClients();
    }, [])

    const getClients = async () => {
        const url = `${baseUrl}/listaregistros?role_id=2`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        setClients(data.registros)
    }
    const handleCloseModal = () => {
        setOpen(false);
    }
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<BrandCenterInfo>> | undefined) => void,) => {
        let errores = [];
        if (!values.nombre) {
            errores.push("El nombre es obligatorio")
        }
        if (!values.ruta) {
            errores.push("El ruta es obligatorio")
        }
        if (!values.archivo) {
            errores.push("El archivo es obligatorio")
        }
        if (!values.etiquetas) {
            errores.push("Las etiquetas son obligatorias")
        }

        const url = `${baseUrl}/registrobrandcenter`;
        const body = new FormData()
        // $client_id = id del cliente
        // $etiquetas = un string de valores separados por coma (',') ese va a ser el separador
        // $nombre    = nombre del elemento que se va a mostrar en el brand center
        // $ruta      = ruta a que carpeta si es una carpeta externa como google drive por ejemplo (incluye el nombre del archivo)
        // $archivo   = nombre del archivo (nuevamente, pero solo el nombre del archivo)
        body.append("user_id", String(selectedClient?.id));
        body.append("nombre", String(values.nombre));
        body.append("etiquetas", String(values.etiquetas));
        body.append("ruta", String(values.ruta));
        body.append("archivo", String(values.archivo));
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options)
            const data = await respuesta.json();

            if (data.exito === "SI") {

                Swal.fire({
                    title: "Exito",
                    text: "Se ha registrado exitosamente",
                    icon: "success"
                })
                resetForm();
                setSelectedClient(null);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })

            }
        }
        catch (err) {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error"
            })
        }
    }
    const seleccionarCliente = (id: number) => {
        const selected = clients?.filter((c) => Number(c.id) === id)[0];
        setSelectedClient(selected ? selected : null);
    }
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography variant="overline" fontWeight="bold">Informacion de Brancenter</Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                    validateOnBlur={false}
                    validateOnMount={false}
                    validateOnChange={false}
                >
                    {({ values, isSubmitting, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Etiquetas" name="etiquetas" onChange={handleChange} value={values.etiquetas} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Nombre" name="nombre" onChange={handleChange} value={values.nombre} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Archivo" name="archivo" onChange={handleChange} value={values.archivo} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Ruta" name="ruta" onChange={handleChange} value={values.ruta} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth disableElevation disabled={isSubmitting} sx={styles.buttonModal} type="button" onClick={() => setOpen(true)} variant="contained">Seleccionar cliente</Button>
                                </Grid>
                                {
                                    selectedClient && (
                                        <Grid xs={12}>
                                            <Box sx={styles.selectedClientContainer}>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Cliente seleccionado</Typography>
                                                    <Typography variant="subtitle2" fontSize={12} color="text.secondary">{selectedClient?.name}</Typography>
                                                </Box>
                                                <Box>
                                                    <CheckCircle color="success" />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={12}>
                                    <Button fullWidth disableElevation disabled={isSubmitting} color="secondary" sx={styles.button} type="submit" variant="contained">Agregar</Button>
                                </Grid>
                            </Grid>
                        </Form>

                    )}
                </Formik>
                <Dialog onClose={handleCloseModal} open={open} fullScreen PaperProps={{ sx: { background: "#F5F5F5" } }}>
                    <AppBar sx={{ position: 'relative' }} elevation={0}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseModal}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Seleccionar Cliente
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {
                        clients && (
                            <Box sx={styles.clientsContainer}>
                                {clients.map((client) => (
                                    <Box sx={styles.clientContainer} key={client.id}>
                                        <Typography variant="subtitle2" fontWeight="bold">{client.name}</Typography>
                                        <IconButton disabled={Number(selectedClient?.id) === Number(client.id)} onClick={() => seleccionarCliente(client.id)}>
                                            {Number(selectedClient?.id) === Number(client.id) ? <CheckCircle color="success" /> : <Circle />}
                                        </IconButton>
                                    </Box>))}
                            </Box>
                        )
                    }
                </Dialog>
            </Box>
        </Layout>
    )
}
const styles = {
    input: {
        color: "black",
        "& fieldset": {
            border: "none",
        },
        "& input": {
            borderRadius: 3,
            background: "#fff",
            color: "black"
        }
    },
    button: {
        p: 2,
        borderRadius: 3,
        textTransform: "none"
    },
    selectedClientContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2
    },
    buttonModal: {
        p: 2,
        borderRadius: 3,
        textTransform: "none",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)"
    },
    clientsContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh"
    },
    clientContainer: {
        width: "100%",
        borderRadius: 5,
        background: "#FFF",
        p: 2,
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-between",
        alignItems: "center"
    }
}