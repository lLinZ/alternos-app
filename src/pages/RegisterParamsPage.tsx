// import { Visibility, VisibilityOff } from '@mui/icons-material'
// import { Box, Typography, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
// import { Box, Grid, TextField, InputAdornment, IconButton, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Box, Grid, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Layout } from '../components/layout'
import { PageTitle } from '../components/ui'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

export const RegisterParamsPage = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const [valorHora, setValorHora] = useState<string>("")
    const [factorPrecio, setFactorPrecio] = useState<string>("")
    const [duracionMinima, setDuracionMinima] = useState<string>("")
    const router = useNavigate();

    /**
     * Funcion para enviar los datos del form a la API
     * @param values Valores del formulario
     */
    const onSubmit = async () => {
        const errores = [];

        if (!valorHora) errores.push("El campo valor de la hora estándar está vacío");
        if (!factorPrecio) errores.push("El campo factor de precio está vacío");
        if (!duracionMinima) errores.push("El campo Duración estándar de las actividades está vacío");

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
        const url = `${baseUrl}/registroparams`;

        const body = new FormData();

        body.append("valorhora", String(valorHora));
        body.append("factorprecio", String(factorPrecio));
        body.append("duracionminima", String(duracionMinima));
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                // const alertaExito = await Swal.fire({
                await Swal.fire({
                    title: "Exito",
                    text: data.mensaje,
                    icon: "success",
                })
                router("/register/params");
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

    const getParams = async () => {
        const url = `${baseUrl}/params`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        if (data.exito === "SI") {
            setValorHora(data.registros[0].valorhora);
            setFactorPrecio(data.registros[0].factorprecio);
            setDuracionMinima(data.registros[0].duracionminima);
        } else {
            setValorHora("");
            setFactorPrecio("");
            setDuracionMinima("");
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getParams();

    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={{ p: 1, width: "80%", margin: "auto" }}>
                <PageTitle title="Parámetros del sistema" />
                <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                    <Grid item xs={4}>
                        <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth value={valorHora} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Valor hora" name="valorhora" type="text" color="secondary" onChange={(e) => setValorHora(e.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth value={factorPrecio} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Factor de Precio" name="factorprecio" type="text" color="secondary" onChange={(e) => setFactorPrecio(e.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth value={duracionMinima} variant="outlined" InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" } }} label="Duración estándar de las actividades" name="duracionminima" type="text" color="secondary" onChange={(e) => setDuracionMinima(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation onClick={onSubmit}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
