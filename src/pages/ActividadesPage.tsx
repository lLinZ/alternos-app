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
export const ActividadesPage: FC<Props> = () => {
    const [userLogged, setUserLogged] = useState();
    const [actividades, setActividades] = useState<Actividades[]>();
    // Tarea delegable
    const [delegable, setDelegable] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Array de funciones disponibles
    const [functions, setFunctions] = useState<IFunction[] | null>(null);

    // Abrir modal de usuarios
    const [openUserModal, setOpenUserModal] = useState(false);
    // Funcion seleccionada
    const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

    // Actividad a registrar
    const [newActivity, setNewActivity] = useState({
        name: "",
        duration: 60,
    })

    // Usuario seleccionado
    const [userSelected, setUserSelected] = useState<SelectedUser | null>(null);

    // Usuarios Registrados en BD
    const [users, setUsers] = useState([]);

    const router = useNavigate();

    const getInformation = async () => {
        const url = `${baseUrl}/listaactividades?id_activity=3&id_owner=`;

        const options = {
            method: "GET",
        }
        const respuesta = await fetch(url, options)
        const data = await respuesta.json();

        if (data.exito === "SI") {
            setActividades(data.registros);
            console.log(data);
        } else {
            console.log("ERROR");
        }
    }
    /**
 * Funcion para controlar el checkbox
 */
    const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
        setDelegable(e.target.checked);
    }
    /**
     * Funcion para seleccionar un usuario
     * @param id ID del usaurio seleccionado
     */
    const selectUser = (id: number, name: string) => {
        setUserSelected({ id, name });
        setOpenUserModal(false);
    }
    const getFunctions = async () => {
        const url = `${baseUrl}/listafunctions`;

        const respuesta = await fetch(url);

        const data = await respuesta.json();

        if (data.exito === "SI") {
            setFunctions(data.registros);
        }
    }
    /**
     * Funcion para obtener usuarios
     */
    const getUsers = async () => {
        const url = `${baseUrl}/listausersxfunction?function_id=${selectedFunction}`
        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                setUsers(data.registros[0].users)
            } else {
                setUsers([]);
                console.log("No se logro encontrar ningún usuario")
            }
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * Funcion para abrir modal
     */
    const openModalUser = () => {
        setOpenUserModal(true);
        getUsers();
    }

    /**
     * Funcion para limpiar el formulario de registro de actividad
     */
    const cleanForm = () => {
        setNewActivity({
            name: "",
            duration: 60,
        });
        setUserSelected(null);
    }

    /**
     * Funcion para 
     * @returns 
     */
    const registrarActividad = async () => {
        setIsSubmitting(true);
        // Url para registrar una actividad
        const url = `${baseUrl}/actividades`;
        let errores = [];

        /* Validaciones
            - Usuario seleccionado
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
            body.append("delegable", delegable ? "SI" : "NO");
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                if (data.exito === "SI") {
                    const newActivityArray = data.registros[0];
                    const newAddedActivity = {
                        id: newActivityArray.id,
                        name: newActivityArray.name,
                        owner_id: newActivityArray.owner_id,
                        owner_name: newActivityArray.owner_name,
                        duration: newActivityArray.duration,
                    }
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
        getInformation();
        getFunctions();
    }, []);
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                {/* {actividades && actividades.map((actividad) => (
                    <Box key={actividad.id} sx={{ mt: 2, p: 2, border: "1px solid rgba(0,0,0,0.5)", borderRadius: "10px" }}>
                        <Typography variant="subtitle1" >{actividad.name}</Typography>
                        <Typography variant="subtitle2">{actividad.owner_name}</Typography>
                    </Box>
                ))} */}
                {/* <Formik children={undefined} initialValues={undefined} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                    throw new Error("Function not implemented.");
                }}>
                    {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                        <Form>
                            <Grid container>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik> */}
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={1}>
                        {
                            userSelected && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={"bold"}>Usuario seleccionado para la actividad</Typography>
                                            <Typography variant="subtitle1" color="text.secondary">{userSelected.name}</Typography>
                                        </Box>
                                        <CheckCircleIcon color="success" />
                                    </Box>
                                </Grid>
                            )
                        }
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField name="name" fullWidth label="Nombre de la actividad" color="secondary" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField name="duration" fullWidth label="Minutos de duracion" color="secondary" value={newActivity.duration} onChange={(e) => setNewActivity({ ...newActivity, duration: Number(e.target.value) })} />
                        </Grid>
                        <Grid item xs={12} >
                            <Select
                                value={selectedFunction ? String(selectedFunction) : '0'}
                                onChange={(e: SelectChangeEvent) => {
                                    if (userSelected) {
                                        setUserSelected(null);
                                    }
                                    setSelectedFunction(Number(e.target.value))
                                }}
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
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                label="Tarea Delegable"
                                control={
                                    <Checkbox
                                        color="secondary"
                                        checked={delegable}
                                        onChange={handleCheckBox}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton loading={isSubmitting} type="button" color="secondary" variant="contained" fullWidth sx={{ p: 1.8 }} onClick={() => registrarActividad()}>Registar actividad</LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Layout>
    )
}
