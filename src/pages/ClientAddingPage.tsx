import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Formik, FormikValues, Form, FormikState } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Layout } from '../components/layout'
import { IFunction } from '../interfaces/function-type'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

const initialValues = {
    name: "",
    phone: "",
    username: "",
}


export const ClientAddingPage = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();

    /**
     * Funcion para enviar los datos del form a la API
     * @param values Valores del formulario
     */
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void) => {
        if (!values) {
            return false;
        }
        const errores = [];

        if (!values.username) errores.push("El campo usuario está vacío");
        if (!values.phone) errores.push("El campo teléfono está vacío");
        if (!values.name) errores.push("El campo nombre está vacío");

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
            return false;
        }
        const url = `${baseUrl}/registrocliente`;

        const body = new FormData();

        body.append("username", String(values.username));
        body.append("name", String(values.name));
        body.append("phone", String(values.phone));
        const options = {
            method: "POST",
            body
        }
        try {

            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                const alertaExito = await Swal.fire({
                    title: "Exito",
                    text: data.mensaje,
                    icon: "success",
                })
                resetForm()
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
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={{ p: 1, width: "80%", margin: "auto" }}>
                <Typography component="h2" fontWeight="bold" variant="overline">Registrar un nuevo cliente</Typography>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: FormikValues, { resetForm }) => onSubmit(values, resetForm)}
                    validateOnMount={false}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {({ values, handleSubmit, handleChange, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item xs={12}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.name} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Nombre y apellido" name="name" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.username} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Usuario" name="username" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.phone} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Teléfono" name="phone" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation>Registrar</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    )
}