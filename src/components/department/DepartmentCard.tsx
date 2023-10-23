import React, { useState, Dispatch, FC, SetStateAction } from 'react'
import { Departamentos } from '../../pages/DepartmentAddingPage'
import EditIcon from "@mui/icons-material/EditOutlined";
import EditOffIcon from "@mui/icons-material/EditOffOutlined";
import { Formik, Form, FormikValues } from "formik";
import Swal from "sweetalert2";
import { Box, Typography, Grid, TextField, Button, IconButton } from '@mui/material';
import { baseUrl } from '../../common/baseUrl';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    departamento: Departamentos;
    setDepartamentos: Dispatch<SetStateAction<Departamentos[] | null>>;
    departamentos: Departamentos[];
}

export const DepartmentCard: FC<Props> = ({ departamento, departamentos, setDepartamentos }) => {
    const [edit, setEdit] = useState<boolean>(false)

    const initialValues = {
        name: departamento.name,
    }

    // departamento a editar
    const [xDepartment, setxDepartment] = useState({
        name: departamento.name,
    })
    
    
    const onSubmit = async (values: FormikValues) => {
        const url = `${baseUrl}/updatedepartamentos`;
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

            body.append("id", String(departamento.id));
            body.append("name", String(values.name));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);

                const data = await respuesta.json();

                if (data.exito === "SI") {
                    const departamentosExclude = departamentos?.filter(a => a.id !== departamento.id);
                    const newDepartmento: Departamentos = {
                        id: departamento.id,
                        name: values.name,
                    }
                    const newDepartamentos: Departamentos[] = departamentosExclude && departamentosExclude.length > 0 ? [...departamentosExclude, newDepartmento] : [newDepartmento]
                    Swal.fire({
                        title: "Exito",
                        text: "Datos editados",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    setDepartamentos(newDepartamentos);
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
        const url = `${baseUrl}/deletedepartment?id=${departamento.id}`;
        const click = await Swal.fire({
            title: "¿Seguro?",
            text: "¿Deseas eliminar el departamento?",
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
                        text: "Actividad eliminado",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    const newState = departamentos ? departamentos?.filter((departmentP) => departmentP.id !== departamento.id) : departamentos;
                    setDepartamentos(newState);
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
        <Box key={departamento.id} sx={styles.mainContainer}>
            {edit ? (<Formik
                initialValues={initialValues}
                onSubmit={(values: FormikValues) => onSubmit(values)}
            >
                {({ values, handleSubmit, handleChange }) => (
                    <Box sx={{ position: "relative" }}>
                        {/* <Typography variant="subtitle1" fontWeight={"bold"}>{departamento.name}</Typography> */}
                        {/* <Typography variant="subtitle2" fontWeight={400} color="text.primary">Departamento {departamento.owner_name}</Typography> */}
                        <IconButton onClick={() => setEdit(false)} color="secondary" sx={{ position: "absolute", top: 5, right: 5 }}>
                            <EditOffIcon />
                        </IconButton>

                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={3}>
                                    <TextField fullWidth label="Nombre" onChange={handleChange} name="name" value={values.name} color="secondary" variant="outlined" />
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
                    <IconButton onClick={() => setEdit(true)} color="secondary" sx={{ position: "absolute", top: -5, right: 5 }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete()} color="secondary" sx={{ position: "absolute", top: -5, right: 35 }}>
                            <DeleteIcon />
                        </IconButton>
                    <Typography variant="subtitle1">{departamento.name}</Typography>
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