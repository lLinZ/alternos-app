// import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Box, Grid, TextField, Button } from '@mui/material'
import { Formik, FormikValues, Form, FormikState } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Layout } from '../components/layout'
import { PageTitle } from '../components/ui'
// import { IFunction } from '../interfaces/function-type'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

const initialValues = {
    name: "",
    phone: "",
    username: "",
    cedularif: "",
    direccionfiscal: "",
    contacto: "",
    descripcion: "",
    cuentacontable: "",
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

        if (!values.username) errores.push("El campo correo electrónico está vacío");
        if (!values.phone) errores.push("El campo teléfono está vacío");
        if (!values.name) errores.push("El campo nombre está vacío");

        if (errores.length > 0) {
            let errorList: string = "";
            errores.forEach(error => errorList += `- ${error} <br />`);
            // const alertaCamposVacios = await Swal.fire({
            await Swal.fire({
                title: "Error",
                html: errorList,
                icon: "error",
            });
            return false;
        }
        if (values.confirmPassword !== values.password) {
            // const alertaError = await Swal.fire({
            await Swal.fire({
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
        body.append("cedularif", String(values.cedularif));
        body.append("direccionfiscal", String(values.direccionfiscal));
        body.append("contacto", String(values.contacto));
        body.append("descripcion", String(values.descripcion));
        body.append("cuentacontable", String(values.cuentacontable));
        const options = {
            method: "POST",
            body
        }
        try {

            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                // const alertaExito = await Swal.fire({
                await Swal.fire({
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
                <PageTitle title="Registrar un nuevo cliente" />

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
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.username} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Correo electrónico" name="username" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.phone} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Teléfono" name="phone" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.cedularif} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Cedula / Rif" name="cedularif" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.contacto} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Contacto" name="contacto" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.cuentacontable} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Cuenta Contable" name="cuentacontable" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.descripcion} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Descripcion" name="descripcion" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.direccionfiscal} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Direccion fiscal" name="direccionfiscal" type="text" color="secondary" />
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