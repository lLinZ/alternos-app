import { FC, useEffect } from 'react';

import { Button, Grid, Link, TextField, Typography, useTheme } from '@mui/material';

import { Formik, Form, FormikValues } from 'formik';
import { Layout } from '../components/layout';
import { baseUrl } from '../common/baseUrl';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { createCookie, getCookieValue } from '../lib/functions';

interface Props {

}
const initialValues = {
    usuario: "",
    password: "",
}

export const LoginPage: FC<Props> = () => {
    // Tema
    const theme = useTheme();

    // Router
    const push = useNavigate();

    useEffect(() => {
        const token = getCookieValue("token");

        if (token) push("/dashboard");
    }, [])

    // Funcion para enviar el formulario
    const onSubmit = async (values: FormikValues) => {

        if (!values.usuario || !values.password) {
            return false;
        }

        const url = `https://alternos.sgc-consultores.com.ve/api/login`;

        const body = new FormData();

        body.append("username", String(values.usuario));
        body.append("password", String(values.password));
        const options: RequestInit = {
            method: 'POST',
            body: body,
        }
        try {
            const respuesta = await fetch(url, options);
            // console.log(respuesta.status)
            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                const user = data.registros[0];
                const alerta = await Swal.fire({
                    title: "Exito",
                    text: "Sesion iniciada exitosamente",
                    icon: "success",
                })
                createCookie("token", user.token);
                createCookie("username", user.username);
                push("/dashboard");
            } else {
                const error = await Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Layout footer={false}>
            <Formik
                initialValues={initialValues}
                onSubmit={(values: FormikValues) => onSubmit(values)}
            >
                {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container display="flex" justifyContent="center" alignItems="center" sx={{ width: { xs: "80%", md: "65%", lg: "50%" }, margin: "20px auto", }}>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <TextField fullWidth onChange={handleChange} label="Usuario" name="usuario" type="text" variant="standard" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <TextField fullWidth onChange={handleChange} label="Contraseña" name="password" type="password" variant="standard" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <LoadingButton type="submit" disabled={isSubmitting} loading={isSubmitting} fullWidth variant="text" color="secondary" sx={{ p: 2 }}>Iniciar sesion</LoadingButton>
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <RouterLink to="/register" style={{ textDecoration: "none" }}>
                                    <Typography color="text.secondary" variant="subtitle2" sx={{ underline: "none" }}>
                                        ¿No tienes cuenta? Regístrate
                                    </Typography>
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout >
    )
}
