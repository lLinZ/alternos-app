// React
import { Dispatch, FC, forwardRef, ReactElement, Ref, SetStateAction, useState, useEffect, ChangeEvent } from 'react';

// MUI
import { Checkbox, FormControlLabel, Box, Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, styled, Divider, Tooltip, AppBar, Dialog, Slide, Toolbar, Grid, TextField, CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Props
import { TransitionProps } from '@mui/material/transitions';
import { Process } from '../../interfaces/process-type';
import { Activity } from '../../interfaces/activity-type';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import { IFunction } from '../../interfaces/function-type';

interface Props {
    process: Process;
    setProcesses: Dispatch<SetStateAction<Process[] | null>>;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface SelectedUser {
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

export const ProcessCard: FC<Props> = ({ process, setProcesses }) => {

    // Control del collapse
    const [expanded, setExpanded] = useState(false);

    // Actividades del proceso actual
    const [actividades, setActividades] = useState<Activity[] | null>(process.actividades && process.actividades?.length > 0 ? process.actividades : null)

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
            body.append("process_id", String(newActivity.process_id));
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
                    setOpenActivityModal(false);
                    setIsSubmitting(false);
                    setActividades(actividades && actividades.length > 0 ? [...actividades, newAddedActivity] : [newAddedActivity])
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha registrado una actividad",
                        icon: "success"
                    })
                    // Se limpian los campos del formulario
                    cleanForm();
                } else {
                    setIsSubmitting(false);
                    setOpenActivityModal(false);
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
        getFunctions();
    }, [])
    return (
        <Card variant="outlined" sx={{ width: "100%", mb: 1 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {process.owner_name}
                </Typography>
                <Typography variant="h5" component="div">
                    {process.name}
                </Typography>
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
                        <Button size="small" color="secondary" sx={{ p: 1 }} onClick={() => setOpenActivityModal(true)}>Añadir actividad</Button>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography fontWeight={"bold"} variant="subtitle1" >Actividades</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                        {
                            (actividades && actividades?.length > 0)
                                ? actividades?.map((actividad: Activity) => (<Tooltip key={actividad.id} placement="right" title={`Asignado a ${actividad.owner_name}, Duracion ${actividad.duration} minutos`} ><Typography>{actividad.name}</Typography></Tooltip>))
                                : "Este proceso no tiene actividades"
                        }
                    </Box>
                </CardContent>
            </Collapse>

            {/* Modal de actividades */}
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
                                <MenuItem value={'0'} disabled>Seleccione una funcion</MenuItem>
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
                            <LoadingButton loading={isSubmitting} disabled={!userSelected} type="button" color="secondary" variant="contained" fullWidth sx={{ p: 1.8 }} onClick={() => registrarActividad()}>Registar actividad</LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>

            {/* Modal de usaurios */}
            <Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition}>
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
            </Dialog>
        </Card >
    )
}
