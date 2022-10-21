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
import CheckCircle from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

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

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<BrandCenterInfo>> | undefined) => void,) => {
        const url = `${baseUrl}/`;
        const body = new FormData()
        // $client_id = id del cliente
        // $etiquetas = un string de valores separados por coma (',') ese va a ser el separador
        // $nombre    = nombre del elemento que se va a mostrar en el brand center
        // $ruta      = ruta a que carpeta si es una carpeta externa como google drive por ejemplo (incluye el nombre del archivo)
        // $archivo   = nombre del archivo (nuevamente, pero solo el nombre del archivo)
        body.append("client_id", String(selectedClient?.id));
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
                    text: "No se logró registrar",
                    icon: "error"
                })

            }
        }
        catch (err) {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: "No se logró registrar",
                icon: "error"
            })
        }
    }
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: { xs: "100%", md: "80%" }, margin: "20px auto", minHeight: "100vh" }}>
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
                                    <TextField fullWidth color="secondary" label="Ruta" name="ruta" onChange={handleChange} value={values.ruta} sx={styles.input} />
                                </Grid>
                                {
                                    selectedClient && (
                                        <Grid xs={12}>
                                            <Box sx={styles.selectedClientContainer}>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Cliente seleccionado</Typography>
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize={12} color="text.secondary">{selectedClient?.name}</Typography>
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
            </Box>
        </Layout>
    )
}
const styles = {
    input: {
        "& fieldset": {
            borderRadius: 3,
        }
    },
    button: {
        p: 1,
        borderRadius: 3,
        textTransform: "none"
    },
    selectedClientContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
    }
}