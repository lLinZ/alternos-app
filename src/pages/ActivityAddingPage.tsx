import { ChangeEvent, FC, useEffect, useState } from "react";

import { Box, Checkbox, FormControlLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

import { Layout } from "../components/layout"
import { validarToken } from "../lib/functions";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../common/baseUrl";
import { LoadingButton } from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import { IFunction } from "../interfaces/function-type";
import { SelectedUser } from "../components/process/ProcessCard";
import Swal from "sweetalert2";

interface Props {

}
export interface Actividades {
    actividades: any[];
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

    // Funcion seleccionada
    const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

    // Actividad a registrar
    const [newActivity, setNewActivity] = useState({
        name: "",
        duration: 60,
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
        }
    }
    /**
     * Funcion para limpiar el formulario de registro de actividad
     */
    const cleanForm = () => {
        setNewActivity({
            name: "",
            duration: 60,
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
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                if (data.exito === "SI") {
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
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Registrar una actividad</Typography>
                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={1} >
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="name" fullWidth label="Nombre de la actividad" color="secondary" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="duration" fullWidth label="Minutos de duracion" color="secondary" value={newActivity.duration} onChange={(e) => setNewActivity({ ...newActivity, duration: Number(e.target.value) })} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Select
                            value={selectedFunction ? String(selectedFunction) : '0'}
                            onChange={
                                (e: SelectChangeEvent) => {
                                    setSelectedFunction(Number(e.target.value))
                                }}
                            fullWidth
                            color="secondary"
                        >
                            <MenuItem value={'0'} disabled>Seleccione un departamento</MenuItem>
                            {
                                departamentos?.map((func: IFunction) => (
                                    <MenuItem key={func.id} value={String(func.id)}>{func.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton loading={isSubmitting} type="button" color="secondary" variant="contained" fullWidth sx={{ p: 1.8 }} onClick={() => registrarActividad()}>Registar actividad</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
