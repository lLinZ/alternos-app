// React
import { Dispatch, FC, forwardRef, ReactElement, Ref, SetStateAction, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";

// MUI
import { Checkbox, FormControlLabel, Box, Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, styled, Divider, Tooltip, AppBar, Dialog, Slide, Toolbar, Grid, TextField, CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/EditOutlined';
import EditOffIcon from '@mui/icons-material/EditOffOutlined';

// Props
import { TransitionProps } from '@mui/material/transitions';
import { Process } from '../../interfaces/process-type';
import { Activity, ActivityFromProcess } from '../../interfaces/activity-type';

import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import { IFunction } from '../../interfaces/function-type';
import { Formik, Form, FormikValues, FormikState } from 'formik';

interface Props {
    process: Process;
    setProcesses: Dispatch<SetStateAction<Process[] | null>>;
    processes?: Process[];
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export interface SelectedUser {
    id: number;
    name: string;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ProcessCard: FC<Props> = ({ process, setProcesses, processes }) => {

    // Control del collapse
    const [expanded, setExpanded] = useState(false);

    // Actividades del proceso actual
    const [actividades, setActividades] = useState<ActivityFromProcess[] | null>(null)

    // Si se está enviando la informacion
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Abrir modal de usuarios
    const [openUserModal, setOpenUserModal] = useState(false);

    // Abrir modal de actividades
    const [openActivityModal, setOpenActivityModal] = useState(false);

    // Tarea delegable
    const [delegable, setDelegable] = useState<boolean>(false);

    // Array de funciones disponibles
    const [functions, setFunctions] = useState<IFunction[] | null>(null);

    // Funcion seleccionada
    const [selectedFunction, setSelectedFunction] = useState<number | null>(null);

    // Actividad a registrar
    const [newActivity, setNewActivity] = useState({
        name: "",
        duration: 60,
        process_id: process.id,
    })

    // Usuario seleccionado
    const [userSelected, setUserSelected] = useState<SelectedUser | null>(null);

    // Usuarios Registrados en BD
    const [users, setUsers] = useState([]);

    const [edit, setEdit] = useState<boolean>(false);
    const router = useNavigate();

    /**
     * Funcion para expandir las opciones del card desplegable
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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

    /**
     * Funcion para abrir modal
     */
    const openModalUser = () => {
        setOpenUserModal(true);
        getUsers();
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
     * Funcion para limpiar el formulario de registro de actividad
     */
    const cleanForm = () => {
        setNewActivity({
            name: "",
            duration: 60,
            process_id: process.id,
        });
        setUserSelected(null);
    }
    const getActividades = async (id: number) => {
        const url = `${baseUrl}/listaactividadesxproceso?process_id=${id}`;

        try {

            const respuesta = await fetch(url);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                setActividades(data.registros[0].activities);
            } else {
                setActividades(null)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const onSubmit = async (values: FormikValues) => {
        const url = `${baseUrl}/updateprocesos`;
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

            body.append("id", String(process.id));
            body.append("owner_id", String(process.owner_id));
            body.append("name", String(values.name));
            body.append("categoria", String(values.categoria));
            body.append("description", String(values.description));
            body.append("centrodecosto1", String(values.centrodecosto1));
            body.append("centrodecosto2", String(values.centrodecosto2));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);

                const data = await respuesta.json();

                if (data.exito === "SI") {
                    const processesExclude = processes?.filter(p => p.id !== process.id);
                    const newProcess: Process = {
                        id: process.id,
                        owner_id: process.owner_id,
                        name: values.name,
                        categoria: values.categoria,
                        description: values.description,
                        centrodecosto1: values.centrodecosto1,
                        centrodecosto2: values.centrodecosto2,
                        owner_name: process.owner_name,
                        costo: process.costo,
                        precio: process.precio
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
                    setProcesses(newProcesses);
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

    const initialValues = {
        name: process.name,
        categoria: process.categoria,
        description: process.description,
        centrodecosto1: process.centrodecosto1,
        centrodecosto2: process.centrodecosto2,
    }
    useEffect(() => {
        getFunctions();
        getActividades(process.id);
    }, [])
    return (
        <Card variant="outlined" sx={{
            width: "100%", mb: 1, border: "none", borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
            background: "rgba(255,255,255,0.6)",
            backdropFilter: 'blur(6px)',
        }}>
            <CardContent>

                {edit ? (
                    <Box>

                        <Box sx={{ position: "relative" }}>
                            <Typography variant="subtitle2" color="text.primary" fontWeight="bold" gutterBottom>
                                {process.owner_name}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {process.name}
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

                                    <Grid container spacing={1} sx={{ mt: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth name="name" value={values.name} label="Nombre" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth name="categoria" value={values.categoria} label="Categoria" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth name="description" value={values.description} label="Descripcion larga" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth name="centrodecosto1" value={values.centrodecosto1} label="Centro de costo 1" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5 }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth name="centrodecosto2" value={values.centrodecosto2} label="Centro de costo 2" onChange={handleChange} color="secondary" variant="outlined" sx={{ borderRadius: 5 }} />
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
                    : (<Box>
                        <Box sx={{ position: "relative" }}>
                            <IconButton onClick={() => setEdit(true)} color="secondary" sx={{ position: "absolute", top: 5, right: 5 }}>

                                <EditIcon />
                            </IconButton>

                        </Box>
                        <Typography variant="subtitle2" color="text.primary" fontWeight="bold" gutterBottom>
                            {process.owner_name}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {process.name}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            {process.description}
                        </Typography>
                        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                            <Typography variant="subtitle2" color="text.primary" sx={{ mr: 1 }} fontWeight="400">
                                Costo
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="400">
                                {process.costo}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                            <Typography variant="subtitle2" color="text.primary" sx={{ mr: 1 }} fontWeight="400">
                                Precio
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="400">
                                {process.precio}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                            <Typography variant="subtitle2" color="text.primary" sx={{ mr: 1 }} fontWeight="400">
                                Centro de costo 1
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="400">
                                {process.centrodecosto1}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                            <Typography variant="subtitle2" color="text.primary" sx={{ mr: 1 }} fontWeight="400">
                                Centro de costo 2
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="400">
                                {process.centrodecosto2}
                            </Typography>
                        </Box>
                    </Box>)}
            </CardContent>
            <CardActions sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>

            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>

                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                        <Button size="small" color="secondary" sx={{ p: 1 }} onClick={() => router("/assignment")}>Añadir actividad</Button>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography fontWeight={"bold"} variant="subtitle1" >Actividades</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                        {
                            (actividades && actividades?.length > 0)
                                ? actividades?.map((actividad: ActivityFromProcess) => (<Tooltip key={actividad.id} placement="right" title={`Asignado a ${actividad.owner_name}, Duracion ${actividad.duration} minutos`} ><Typography>{actividad.activity_name}</Typography></Tooltip>))
                                : "Este proceso no tiene actividades"
                        }
                    </Box>
                </CardContent>
            </Collapse>

            {/* Modal de actividades
            <Dialog onClose={() => setOpenActivityModal(false)} open={openActivityModal} fullScreen TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenActivityModal(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Registrar actividad del proceso {process.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
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
            </Dialog> */}

            {/* Modal de usaurios */}
            {/* <Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenUserModal(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar usuario
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {users ? users.map((usuario: { user_id: number; user_name: string; }) => (
                        <Box key={usuario.user_id} sx={{ p: 2, borderRadius: "10px", border: "1px solid black", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Typography>{usuario.user_name}</Typography>
                            <Button color="secondary" onClick={() => selectUser(usuario.user_id, usuario.user_name)}>Seleccionar</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog> */}
        </Card>
    )
}
