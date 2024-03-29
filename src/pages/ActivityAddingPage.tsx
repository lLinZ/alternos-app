import React, { ChangeEvent, FC, useEffect, useState } from "react";

import { InputAdornment, Box, Checkbox, FormControlLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

import { Layout } from "../components/layout"
import { validarToken } from "../lib/functions";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../common/baseUrl";
import { LoadingButton } from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import { IFunction } from "../interfaces/function-type";
import { SelectedUser } from "../components/process/ProcessCard";
import Swal from "sweetalert2";
import { PageTitle } from "../components/ui";

interface Props {

}
export interface Actividades {
    duration: any;
    formulario?: any;
    costo?: string;
    precio?: string;
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
}
export const ActivityAddingPage: FC<Props> = () => {

    // Usuario logeado
    const [userLogged, setUserLogged] = useState();

    // Loader
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Array de funciones disponibles
    const [departamentos, setDepartamentos] = useState<IFunction[] | null>(null);

    // Parámetros
    const [valorhora, setValorhora] = useState(1);
    const [factorprecio, setFactorprecio] = useState(1);
    const [duracionminima, setDuracionminima] = useState(0);

    // Funcion seleccionada
    const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

    // Actividad a registrar
    const [newActivity, setNewActivity] = useState({
        name: "",
        duration: 0,
        costo: 1,
        precio: 1,
    })

    // Router
    const router = useNavigate();

    /**
     * Funcion para obtener los departamentos disponibles
     */
    const getDepartamentos = async () => {
        const url = `${baseUrl}/listafunctions`;

        const respuesta = await fetch(url);

        const data = await respuesta.json();

        if (data.exito === "SI") {
            setDepartamentos(data.registros);
            setValorhora(data.valorhora);
            setFactorprecio(data.factorprecio);
            setDuracionminima(data.duracionminima);
        }
    }
    /**
     * Funcion para limpiar el formulario de registro de actividad
     */
    const cleanForm = () => {
        setNewActivity({
            name: "",
            duration: 0,
            costo: 1,
            precio: 1,
        });
        setSelectedFunction(null);
    }

    /**
     * Funcion para validar datos del formulario, enviar los datos de la actividad a la API y añadir la actividad
     * @returns 
     */
    const registrarActividad = async () => {
        setIsSubmitting(true);
        // Url para registrar una actividad
        const url = `${baseUrl}/actividades`;
        let errores = [];

        /* Validaciones
            - Departamento seleccionado
            - Nombre de actividad
            - Duracion
        */
        if (!selectedFunction) {
            errores.push("Debe asignar una funcion a la actividad");
        }
        if (!newActivity.name) {
            errores.push("Debe asignar un nombre a la actividad");
        }
        if (!newActivity.duration) {
            errores.push("Debe seleccionar una duracion");
        }
        if (!newActivity.costo) {
            errores.push("Debe colocar un costo");
        }
        if (!newActivity.precio) {
            errores.push("Debe colocar un precio");
        }

        // Si existen errores
        if (errores.length > 0) {
            Swal.fire({
                title: "Error",
                html: errores.map(e => `- ${e}</br>`),
                icon: "error",
            })
            setIsSubmitting(false);
            return false;
        } else {
            // Datos del formulario
            const body = new FormData();
            body.append("name", String(newActivity.name));
            body.append("owner_id", String(selectedFunction));
            body.append("duration", String(newActivity.duration));
            body.append("costo", String(newActivity.costo));
            body.append("precio", String(newActivity.precio));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                if (data.exito === "SI") {
                    console.log({ data })
                    setIsSubmitting(false);
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha registrado una actividad",
                        icon: "success"
                    })
                    // Se limpian los campos del formulario
                    cleanForm();
                } else {
                    setIsSubmitting(false);
                    Swal.fire({
                        title: "Error",
                        text: data.mensaje,
                        icon: "error"
                    })
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    text: "Error",
                    title: "No se logró conectar con el servidor",
                    icon: "error"
                })
                setIsSubmitting(false);
            }
        }

    }
    useEffect(() => {
        validarToken(router, setUserLogged)
        getDepartamentos();
    }, []);
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <PageTitle title="Registrar actividad" />

                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2} >
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", borderRadius: 5 } }} sx={{ "& fieldset": { border: "none" }, borderRadius: 5 }} name="name" fullWidth label="Nombre de la actividad" color="secondary" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Select
                            value={selectedFunction ? String(selectedFunction) : '0'}
                            onChange={
                                (e: SelectChangeEvent) => {
                                    setSelectedFunction(Number(e.target.value))
                                }}
                            fullWidth
                            sx={{ "& fieldset": { border: "none" }, borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)" }}
                            color="secondary"
                        >
                            <MenuItem value={'0'} disabled>Departamento responsable</MenuItem>
                            {
                                departamentos?.map((func: IFunction) => (
                                    <MenuItem key={func.id} value={String(func.id)}>{func.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", borderRadius: 5 }, }} sx={{ "& fieldset": { border: "none" }, borderRadius: 5 }} name="duration" fullWidth label="Minutos de duracion" color="secondary" value={newActivity.duration} onChange={(e) => {
                                setNewActivity({ ...newActivity, duration: Number(e.target.value), costo: Number(e.target.value)*(valorhora/60), precio: Number(e.target.value)*(valorhora/60)*factorprecio });
                            }
                        } />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <TextField InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", borderRadius: 5 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ "& fieldset": { border: "none" }, borderRadius: 5 }} name="costo" fullWidth label="Costo teórico" color="secondary" value={newActivity.costo} onChange={(e) => setNewActivity({ ...newActivity, costo: Number(e.target.value) })} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", borderRadius: 5 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} sx={{ "& fieldset": { border: "none" }, borderRadius: 5 }} name="precio" fullWidth label="Precio Teórico" color="secondary" value={newActivity.precio} onChange={(e) => setNewActivity({ ...newActivity, precio: Number(e.target.value) })} />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton loading={isSubmitting} type="button" color="secondary"
                            variant="contained" fullWidth onClick={() => registrarActividad()} disableElevation sx={{ borderRadius: 5, p: 2, textTransform: "none" }}>Registar actividad</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
