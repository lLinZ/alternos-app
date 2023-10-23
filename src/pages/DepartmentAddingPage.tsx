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
export interface Departamentos {
    id: number;
    name: string;
}
export const DepartmentAddingPage: FC<Props> = () => {

    // Usuario logeado
    const [userLogged, setUserLogged] = useState();

    // Loader
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Array de funciones disponibles
    const [departamentos, setDepartamentos] = useState<IFunction[] | null>(null);

    // Funcion seleccionada
    // const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

    // Actividad a registrar
    const [newDepartment, setNewDepartment] = useState({
        name: "",
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
        setNewDepartment({
            name: "",
        });
    }

    /**
     * Funcion para validar datos del formulario, enviar los datos de la actividad a la API y añadir la actividad
     * @returns 
     */
    const registrarDepartamento = async () => {
        setIsSubmitting(true);
        // Url para registrar una actividad
        const url = `${baseUrl}/registrafunctions`;
        let errores = [];

        /* Validaciones
            - Departamento seleccionado
            - Nombre de actividad
            - Duracion
        */
        if (!newDepartment.name) {
            errores.push("Debe asignar un nombre al departamento");
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
            body.append("name", String(newDepartment.name));
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
                        text: "Se ha registrado un departamento",
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
                <PageTitle title="Registrar departamento" />

                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={2} >
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField InputProps={{ sx: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", borderRadius: 5 } }} sx={{ "& fieldset": { border: "none" }, borderRadius: 5 }} name="name" fullWidth label="Nombre del departamento" color="secondary" value={newDepartment.name} onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton loading={isSubmitting} type="button" color="secondary"
                            variant="contained" fullWidth onClick={() => registrarDepartamento()} disableElevation sx={{ borderRadius: 5, p: 2, textTransform: "none" }}>Registar departamento</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
