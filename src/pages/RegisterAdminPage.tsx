import { FC, useState } from 'react';

import { Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Formik, Form, FormikValues } from 'formik';

import { Layout } from '../components/layout';
import { baseUrl } from '../common/baseUrl';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Props {

}
const initialValues = {
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    username: "",
}

export const RegisterAdminPage: FC<Props> = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const push = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const onSubmit = async (values: FormikValues) => {
        if (!values) {
            return false;
        }
        const errores = [];

        if (!values.username) errores.push("El campo usuario está vacío");
        if (!values.password) errores.push("El campo contraseña está vacío");
        if (!values.phone) errores.push("El campo teléfono está vacío");
        if (!values.name) errores.push("El campo nombre está vacío");
        if (!values.confirmPassword) errores.push("El campo de confirmación está vacío");

        if (errores.length > 0) {
            let errorList: string = "";
            errores.forEach(error => errorList += `- ${error} <br />`);
            const alertaCamposVacios = await Swal.fire({
                title: "Error",
                html: errorList,
                icon: "error",
            });
            return false;
        }
        if (values.confirmPassword !== values.password) {
            const alertaError = await Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
            })
        }
        const url = `${baseUrl}/registro`;

        const body = new FormData();

        body.append("username", values.usuario);
        body.append("password", values.password);
        body.append("name", values.name);
        body.append("phone", values.phone);
        body.append("role_id", String(1));

        const options = {
            method: "POST",
            body
        }
        try {

            const respuesta = await fetch(url, options);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                const alertaExito = await Swal.fire({
                    title: "Exito",
                    text: data.mensaje,
                    icon: "success",
                })
                push("/");
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "No se logro conectar con el servidor",
                icon: "error",
            })
        }
    }

    return (
        <Layout footer={false}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Registrar Administrador</Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: FormikValues) => onSubmit(values)}
                >
                    {({ values, handleSubmit, handleChange, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item xs={12} sx={{ mt: 3 }}>
                                    <TextField fullWidth onChange={handleChange} variant="standard" label="Nombre y apellido" name="name" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 3 }}>
                                    <TextField fullWidth onChange={handleChange} variant="standard" label="Usuario" name="username" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 3 }}>
                                    <TextField fullWidth onChange={handleChange} variant="standard" label="Teléfono" name="phone" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
                                    <TextField fullWidth onChange={handleChange} variant="standard" label="Contraseña" name="password" type={showPassword ? "text" : "password"} color="secondary"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }} />
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
                                    <TextField fullWidth onChange={handleChange} variant="standard" label="Confirmar contraseña" name="confirmPassword" type={showPassword ? "text" : "password"} color="secondary"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }} />
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 3 }}>
                                    <Button type="submit" fullWidth variant="outlined" color="secondary" sx={{ p: 2 }}>Registrarse como admin</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    )
}
