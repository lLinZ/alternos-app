import { FC, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, TextField, Button, Box, IconButton, Typography, Tooltip } from '@mui/material';

import EditIcon from '@mui/icons-material/EditOutlined';
import EditOffIcon from '@mui/icons-material/EditOffOutlined';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { Process } from '../interfaces/process-type';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import { Formik, Form, FormikValues } from "formik";
import Swal from 'sweetalert2';

export const ExternalProcessPage: FC = () => {
    const [edit, setEdit] = useState<boolean>(false);
    const [userLogged, setUserLogged] = useState<User | null>(null);

    const [process, setProcess] = useState<Process[] | null>(null)

    const router = useNavigate();

    const getProcess = async () => {
        const url = `${baseUrl}/listaprocesosexternos`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            if (data.exito === "SI") {
                setProcess(data.registros)
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se encontraron los procesos",
                    icon: "error",
                })
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error",
            })
        }

    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getProcess();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography component="h2" fontWeight="bold" variant="overline" >Lista de procesos externos</Typography>
                    <IconButton color="secondary" size="small" onClick={() => router("/process/external/add")}>
                        <Tooltip title="Añadir proceso externo">
                            <AddCircleOutline color="info" />
                        </Tooltip>
                    </IconButton>
                </Box>
                <ExternalProcessList process={process} setProcess={setProcess} />
            </Box>
        </Layout>
    )
}
interface ExternalProcessListProps {
    process: Process[] | null;
    setProcess: Dispatch<SetStateAction<Process[] | null>>;
}
const ExternalProcessList: FC<ExternalProcessListProps> = ({ process, setProcess }) => {
    return (
        <>
            {
                process && process.map((proceso: Process) => (<ExternalProcessData key={proceso.id} proceso={proceso} process={process} setProcess={setProcess} />))
            }
        </>
    )
}

interface ExternalProcessDataProps {
    proceso: Process | null;
    process: Process[] | null;
    setProcess: Dispatch<SetStateAction<Process[] | null>>;
}
const ExternalProcessData: FC<ExternalProcessDataProps> = ({ proceso, process, setProcess }) => {
    const [edit, setEdit] = useState<boolean>(false);

    const initialValues = {
        name: proceso?.name,
        description: proceso?.description,
        centrodecosto1: proceso?.centrodecosto1,
        centrodecosto2: proceso?.centrodecosto2,
    }

    const onSubmit = async (values: FormikValues) => {
        if (proceso) {
            const url = `${baseUrl}/updateprocesosexternos`;
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

                body.append("id", String(proceso?.id));
                body.append("owner_id", String(proceso?.owner_id));
                body.append("name", String(values.name));
                body.append("description", String(values.description));
                body.append("centrodecosto1", String(values.centrodecosto1));
                body.append("centrodecosto2", String(values.centrodecosto2));
                body.append("precio", String(proceso.precio));
                body.append("costo", String(proceso.costo));
                const options = {
                    method: "POST",
                    body
                }
                try {
                    const respuesta = await fetch(url, options);

                    const data = await respuesta.json();

                    if (data.exito === "SI") {
                        const processesExclude = process?.filter(p => p.id !== proceso?.id);
                        const newProcess: Process = {
                            id: proceso?.id,
                            name: values.name,
                            description: values.description,
                            centrodecosto1: values.centrodecosto1,
                            centrodecosto2: values.centrodecosto2,
                            owner_name: proceso?.owner_name,
                            costo: proceso?.costo,
                            precio: proceso?.precio
                        }
                        const newProcesses: Process[] = processesExclude && processesExclude.length > 0 ? [...processesExclude, newProcess] : [newProcess]
                        Swal.fire({
                            title: "Exito",
                            text: "Datos editados",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                            timerProgressBar: true,
                        })
                        newProcesses.sort((a, b) => a.id - b.id);
                        setProcess(newProcesses);
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
        } else {
            return false;
        }
    }
    return (
        <>
            {
                proceso ?
                    (
                        edit ? (
                            <Box sx={{
                                p: 2, borderRadius: 5, mb: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                                background: "rgba(255,255,255,0.6)",
                                backdropFilter: 'blur(6px)',
                            }}>

                                <Box sx={{ position: "relative" }}>
                                    <Typography variant="subtitle2" color="text.primary" fontWeight="bold" gutterBottom>
                                        {proceso?.owner_name}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {proceso?.name}
                                    </Typography>
                                    <IconButton onClick={() => setEdit(false)} color="secondary" sx={{ position: "absolute", top: 5, right: 5 }}>
                                        <EditOffIcon />
                                    </IconButton>
                                </Box>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={(values) => onSubmit(values)}
                                >
                                    {({ values, handleSubmit, handleChange }) => (

                                        <Form onSubmit={handleSubmit}>

                                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField fullWidth name="name" value={values.name} label="Nombre" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5, "& fieldset": { borderRadius: 3 } }} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField fullWidth name="description" value={values.description} label="Descripcion larga" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5, "& fieldset": { borderRadius: 3 } }} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField fullWidth name="centrodecosto1" value={values.centrodecosto1} label="Centro de costo 1" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5, "& fieldset": { borderRadius: 3 } }} />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField fullWidth name="centrodecosto2" value={values.centrodecosto2} label="Centro de costo 2" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5, "& fieldset": { borderRadius: 3 } }} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button fullWidth variant="contained" color="secondary" type="submit" disableElevation sx={{ borderRadius: 3, p: 1.8, textTransform: "none" }}>Guardar cambios</Button>
                                                </Grid>

                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                        )
                            : (
                                <Box key={proceso?.id} sx={{
                                    p: 2, borderRadius: 5, mb: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                                    background: "rgba(255,255,255,0.6)",
                                    backdropFilter: 'blur(6px)',
                                }}>
                                    <Box sx={{ position: "relative" }}>
                                        <IconButton onClick={() => setEdit(true)} color="secondary" sx={{ position: "absolute", top: 0, right: 0 }}>

                                            <EditIcon />
                                        </IconButton>

                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={"bold"}>{proceso?.name}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">{proceso?.description}</Typography>
                                    <Typography variant="subtitle2" fontWeight={400} color="text.primary">{proceso?.owner_name}</Typography>
                                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Costo {proceso?.costo}</Typography>
                                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Precio {proceso?.precio}</Typography>
                                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Centro de costo 1: {proceso?.centrodecosto1}</Typography>
                                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Centro de costo 2: {proceso?.centrodecosto2}</Typography>
                                </Box>
                            )
                    ) : (<Typography>No existe el proceso</Typography>)
            }
        </>
    )
}