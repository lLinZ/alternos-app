import React, { useState, Dispatch, FC, SetStateAction } from 'react'
import { Actividades } from '../../pages/ActivityAddingPage'
import EditIcon from "@mui/icons-material/EditOutlined";
import EditOffIcon from "@mui/icons-material/EditOffOutlined";
import { Formik, Form, FormikValues } from "formik";
import Swal from "sweetalert2";
import { Box, Typography, Grid, TextField, Button, IconButton } from '@mui/material';
import { baseUrl } from '../../common/baseUrl';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    actividad: Actividades;
    setActividades: Dispatch<SetStateAction<Actividades[] | null>>;
    actividades: Actividades[];
    valorhora?: number;
    factorprecio?: number;
}

export const ActivityCard: FC<Props> = ({ actividad, actividades, setActividades, valorhora, factorprecio }) => {
    const [edit, setEdit] = useState<boolean>(false)

    const initialValues = {
        name: actividad.name,
        duration: actividad.duration,
        costo: actividad.costo,
        precio: actividad.precio,
    }

    // Actividad a editar
    const [xActivity, setxActivity] = useState({
        name: actividad.name,
        duration: actividad.duration,
        costo: actividad.costo,
        precio: actividad.precio,
    })
    
    
    const onSubmit = async (values: FormikValues) => {
        const url = `${baseUrl}/updateactividades`;
        const body = new FormData();
        const click = await Swal.fire({
            title: "¿Seguro?",
            text: "¿Deseas editar los datos?",
            icon: "warning",
            showCancelButton: true,
        })
        if (click.isConfirmed) {

            if (!values.name) {
                Swal.fire({
                    title: "Erorr",
                    text: "El campo nombre es obligatorio",
                    icon: "error",
                })
                return false;
            }

            body.append("id", String(actividad.id));
            body.append("owner_id", String(actividad.owner_id));
            body.append("name", String(values.name));
            body.append("duration", String(xActivity.duration));
            body.append("formulario", String(actividad.formulario));
            body.append("costo", String(xActivity.costo));
            body.append("precio", String(xActivity.precio));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);

                const data = await respuesta.json();

                if (data.exito === "SI") {
                    const actividadesExclude = actividades?.filter(a => a.id !== actividad.id);
                    const newActividad: Actividades = {
                        id: actividad.id,
                        owner_id: actividad.owner_id,
                        name: values.name,
                        duration: xActivity.duration,
                        formulario: actividad.formulario,
                        owner_name: actividad.owner_name,
                        costo: xActivity.costo,
                        precio: xActivity.precio,
                    }
                    const newActividades: Actividades[] = actividadesExclude && actividadesExclude.length > 0 ? [...actividadesExclude, newActividad] : [newActividad]
                    Swal.fire({
                        title: "Exito",
                        text: "Datos editados",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    setActividades(newActividades);
                    setEdit(false);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se editaron los datos",
                        icon: "error",
                    })
                }

            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: "Error interno del servidor",
                    icon: "error",
                })
            }
        }
    }

    const onDelete = async () => {
        const url = `${baseUrl}/deleteactivity?id=${actividad.id}`;
        const click = await Swal.fire({
            title: "¿Seguro?",
            text: "¿Deseas eliminar la actividad?",
            icon: "warning",
            showCancelButton: true,
        })
        if (click.isConfirmed) {
            try {
                const respuesta = await fetch(url);

                const data = await respuesta.json();

                if (data.exito === "SI") {

                    Swal.fire({
                        title: "Exito",
                        text: "Actividad eliminada",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    const newState = actividades ? actividades?.filter((activityP) => activityP.id !== actividad.id) : actividades;
                    setActividades(newState);
                    //router("/");
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
                    text: "Error interno del servidor",
                    icon: "error",
                })
            }
        }
    }

    return (
        <Box key={actividad.id} sx={styles.mainContainer}>
            {edit ? (<Formik
                initialValues={initialValues}
                onSubmit={(values: FormikValues) => onSubmit(values)}
            >
                {({ values, handleSubmit, handleChange }) => (
                    <Box sx={{ position: "relative" }}>
                        <Typography variant="subtitle1" fontWeight={"bold"}>{actividad.name}</Typography>
                        <Typography variant="subtitle2" fontWeight={400} color="text.primary">Departamento {actividad.owner_name}</Typography>
                        <IconButton onClick={() => setEdit(false)} color="secondary" sx={{ position: "absolute", top: 5, right: 5 }}>

                            <EditOffIcon />
                        </IconButton>

                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Nombre" onChange={handleChange} name="name" value={values.name} color="secondary" variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    {/* <TextField fullWidth label="Duración" onChange={handleChange} name="duration" value={values.duration} color="secondary" variant="outlined" /> */}
                                    <TextField fullWidth label="Duración" onChange={
                                        (e) => {
                                            setxActivity({ ...xActivity, duration: Number(e.target.value), costo: String(Number(e.target.value)*(Number(valorhora)/60)), precio: String(Number(e.target.value)*(Number(valorhora)/60)*Number(factorprecio)) });
                                        }
                                    } name="duration" value={xActivity.duration}  color="secondary" variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Costo" onChange={handleChange} name="costo" value={xActivity.costo} color="secondary" variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Precio" onChange={handleChange} name="precio" value={xActivity.precio} color="secondary" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth disableElevation type="submit" color="secondary" variant="contained" sx={styles.button}>Guardar cambios</Button>
                                </Grid>
                            </Grid>

                        </Form>
                    </Box>
                )}
            </Formik>)
                : (<Box sx={{ position: "relative" }}>
                    <IconButton onClick={() => setEdit(true)} color="secondary" sx={{ position: "absolute", top: 5, right: 5 }}>
                        <EditIcon />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight={"bold"}>{actividad.name}
                        <IconButton onClick={() => onDelete()} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={400} color="text.primary">Departamento {actividad.owner_name}</Typography>
                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Costo {actividad.costo}</Typography>
                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Precio {actividad.precio}</Typography>
                </Box>)}
        </Box>
    )
}
const styles = {
    mainContainer: {
        p: 2, borderRadius: 5, mb: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
        background: "rgba(255,255,255,0.6)",
        backdropFilter: 'blur(6px)',
    },
    button: {
        p: 1.8,
        borderRadius: 3,
        textTransform: "none",
    }
}