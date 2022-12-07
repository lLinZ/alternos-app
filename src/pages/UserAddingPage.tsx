import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Formik, FormikValues, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Layout } from '../components/layout'
import { PageTitle } from '../components/ui'
import { IFunction } from '../interfaces/function-type'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

const initialValues = {
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    username: "",
}


export const UserAddingPage = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [functions, setFunctions] = useState<IFunction[] | null>(null);
    const [selectedFunction, setSelectedFunction] = useState<number | null>(null);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const router = useNavigate();

    /**
     * Funcion para enviar los datos del form a la API
     * @param values Valores del formulario
     */
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
        if (!selectedFunction) errores.push("El campo de funcion está vacío");

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
        const url = `${baseUrl}/registro`;

        const body = new FormData();

        body.append("username", String(values.username));
        body.append("password", String(values.password));
        body.append("name", String(values.name));
        body.append("phone", String(values.phone));
        body.append("function_id", selectedFunction ? String(selectedFunction) : '1');
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
                router("/admin");
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

    const getFunctions = async () => {

        const url = `${baseUrl}/listafunctions`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        if (data.exito === "SI") {
            setFunctions(data.registros);
        } else {
            setFunctions(null);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getFunctions();

    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={{ p: 1, width: "80%", margin: "auto" }}>
                <PageTitle title="Registrar un nuevo usuario" />

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: FormikValues) => onSubmit(values)}
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
                                <Grid item xs={12}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.username} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Usuario" name="username" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.phone} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Teléfono" name="phone" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.password} variant="outlined" InputProps={{
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
                                        ), sx: { borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)" }
                                    }} label="Contraseña" name="password" type={showPassword ? "text" : "password"} color="secondary"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.confirmPassword} variant="outlined" InputProps={{
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
                                        ), sx: { borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)" }
                                    }} label="Confirmar contraseña" name="confirmPassword" type={showPassword ? "text" : "password"} color="secondary"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Select
                                        value={selectedFunction ? String(selectedFunction) : '0'}
                                        onChange={(e: SelectChangeEvent) => {
                                            setSelectedFunction(Number(e.target.value))
                                        }}
                                        sx={{ borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", "& fieldset": { border: "none" }, }}
                                        fullWidth
                                        color="secondary"
                                    >
                                        <MenuItem value={'0'} disabled>Seleccione un departamento</MenuItem>
                                        {
                                            functions?.map((func: IFunction) => (
                                                <MenuItem key={func.id} value={String(func.id)}>{func.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation>Registrar usuario</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    )
}
