// import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Box, Typography, Grid, TextField, Button } from '@mui/material'
import { Formik, FormikValues, Form, FormikState } from 'formik'
import React, { ChangeEvent, useEffect, Ref, useRef, useState } from 'react'
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
    brand: "",
    phone: "",
    username: "",
    cedularif: "",
    direccionfiscal: "",
    contacto: "",
    descripcion: "",
    cuentacontable: "",
    tipodecontribuyente: "",
    ciudad: "",
    codigopostal: "",
    estado: "",
    redessociales: "",
    web: "",
    docrif: "",
    doccedula: "",
    docregistro: "",
    manualdemarca: ""
}


export const ClientAddingPage = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();

    const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
    const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
    const [selectedFile3, setSelectedFile3] = useState<File | null>(null);
    const [selectedFile4, setSelectedFile4] = useState<File | null>(null);
    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)
    const ref4 = useRef<HTMLInputElement>(null)

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
        if (!values.brand) errores.push("El campo marca está vacío");

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
        body.append("brand", String(values.brand));
        body.append("phone", String(values.phone));
        body.append("cedularif", String(values.cedularif));
        body.append("direccionfiscal", String(values.direccionfiscal));
        body.append("contacto", String(values.contacto));
        body.append("descripcion", String(values.descripcion));
        body.append("cuentacontable", String(values.cuentacontable));
        body.append("tipodecontribuyente", String(values.tipodecontribuyente));
        body.append("ciudad", String(values.ciudad));
        body.append("codigopostal", String(values.codigopostal));
        body.append("estado", String(values.estado));
        body.append("redessociales", String(values.redessociales));
        body.append("web", String(values.web));

        body.append("docrif", selectedFile1 ? selectedFile1 : '');
        body.append("doccedula", selectedFile2 ? selectedFile2 : '');
        body.append("docregistro", selectedFile3 ? selectedFile3 : '');
        body.append("manualdemarca", selectedFile4 ? selectedFile4 : '');

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
                setSelectedFile1(null);
                setSelectedFile2(null);
                setSelectedFile3(null);
                setSelectedFile4(null);
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
                                <Grid item xs={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.name} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Marca" name="brand" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.name} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Nombre o razón social" name="name" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.name} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Nombre o razón social" name="name" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.descripcion} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Descripcion del negocio o actividad" name="descripcion" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.contacto} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Contacto" name="contacto" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.phone} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Teléfono" name="phone" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.tipodecontribuyente} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Tipo de contribuyente" name="tipodecontribuyente" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.cedularif} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Cedula / Rif" name="cedularif" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.ciudad} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Ciudad" name="ciudad" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.codigopostal} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Código Postal" name="codigopostal" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.estado} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Estado" name="estado" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.direccionfiscal} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Direccion fiscal" name="direccionfiscal" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.redessociales} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Redes Sociales" name="redessociales" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.username} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Correo electrónico" name="username" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.web} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="WEB" name="web" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} multiline value={values.cuentacontable} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Cuenta Contable" name="cuentacontable" type="text" color="secondary" />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        selectedFile1 && (
                                            <>
                                                <Typography variant="overline">R.I.F.</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{selectedFile1.name}</Typography>
                                            </>
                                        )
                                    }
                                    <Button type="button" variant="contained" color={selectedFile1 ? "success" : "info"} fullWidth sx={{
                                        textTransform: "none",
                                        p: 1.8,
                                        borderRadius: 5,
                                        marginBlock: 1,
                                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                                    }} onClick={() => ref1 !== null && ref1.current?.click()}>{selectedFile1 ? 'Cambiar archivo' : 'R.I.F.'}</Button>

                                    <input
                                        ref={ref1 as any}
                                        type="file"
                                        style={{ display: "none" }}
                                        accept={"*/*"}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setSelectedFile1(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                            e.target.value = "";
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        selectedFile2 && (
                                            <>
                                                <Typography variant="overline">Imagen de la Cédula de Identidad </Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{selectedFile2.name}</Typography>
                                            </>
                                        )
                                    }
                                    <Button type="button" variant="contained" color={selectedFile2 ? "success" : "info"} fullWidth sx={{
                                        textTransform: "none",
                                        p: 1.8,
                                        borderRadius: 5,
                                        marginBlock: 1,
                                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                                    }} onClick={() => ref2 !== null && ref2.current?.click()}>{selectedFile2 ? 'Cambiar archivo' : 'Imagen de la Cédula de Identidad'}</Button>

                                    <input
                                        ref={ref2 as any}
                                        type="file"
                                        style={{ display: "none" }}
                                        accept={"*/*"}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setSelectedFile2(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                            e.target.value = "";
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        selectedFile3 && (
                                            <>
                                                <Typography variant="overline">Registro Mercantil</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{selectedFile3.name}</Typography>
                                            </>
                                        )
                                    }
                                    <Button type="button" variant="contained" color={selectedFile3 ? "success" : "info"} fullWidth sx={{
                                        textTransform: "none",
                                        p: 1.8,
                                        borderRadius: 5,
                                        marginBlock: 1,
                                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                                    }} onClick={() => ref3 !== null && ref3.current?.click()}>{selectedFile3 ? 'Cambiar archivo' : 'Registro Mercantil'}</Button>

                                    <input
                                        ref={ref3 as any}
                                        type="file"
                                        style={{ display: "none" }}
                                        accept={"*/*"}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setSelectedFile3(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                            e.target.value = "";
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        selectedFile4 && (
                                            <>
                                                <Typography variant="overline">Manual de marca</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{selectedFile4.name}</Typography>
                                            </>
                                        )
                                    }
                                    <Button type="button" variant="contained" color={selectedFile4 ? "success" : "info"} fullWidth sx={{
                                        textTransform: "none",
                                        p: 1.8,
                                        borderRadius: 5,
                                        marginBlock: 1,
                                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                                    }} onClick={() => ref4 !== null && ref4.current?.click()}>{selectedFile4 ? 'Cambiar archivo' : 'Manual de marca'}</Button>

                                    <input
                                        ref={ref4 as any}
                                        type="file"
                                        style={{ display: "none" }}
                                        accept={"*/*"}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setSelectedFile4(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                            e.target.value = "";
                                        }}
                                    />
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