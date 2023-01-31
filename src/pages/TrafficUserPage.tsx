import { LoadingButton } from "@mui/lab";
import { Box, Typography, CircularProgress, Grid, Button, Dialog, AppBar, Toolbar, IconButton, Divider, Slide, DialogActions, TextField } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { ChangeEvent, FC, forwardRef, ReactElement, Ref, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { baseUrl } from "../common/baseUrl";
import { Layout } from "../components/layout";
import { User } from "../interfaces/user-type";
import { getCookieValue, validarToken } from "../lib/functions";
import { IRequirement } from "./UserRequirementsPage";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/EditRounded';
import EditOffIcon from '@mui/icons-material/EditOffRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { PageTitle } from "../components/ui";
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// interface SelectedUser {
//     id: number;
//     name: string;
// }
export const TrafficUserPage: FC = () => {
    // Datos del usuario loggeado
    const [userLogged, setUserLogged] = useState<User | null>(null);

    // Mis requerimientos
    const [myRequirements, setMyRequirements] = useState<IRequirement[] | null>(null);

    // Control del modal
    const [open, setOpen] = useState<boolean>(false);

    // Tarea seleccionada
    const [selectedTask, setSelectedTask] = useState<IRequirement | null>(null);

    // Loader
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Enviando formulario
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Loader
    // const [respuestaReq, setRespuestaReq] = useState<string>("");

    // Control del modal de usuarios
    const [openUserModal, setOpenUserModal] = useState<boolean>(false);


    const [actividades, setActividades] = useState<any>(null);

    const [selectedActividades, setSelectedActividades] = useState<any>(null);

    const [currentActividad, setCurrentActividad] = useState<any>(null)

    const [currentFechasVencimiento, setCurrentFechasVencimiento] = useState<any>(null);
    // Router
    const router = useNavigate();

    const selectuserDeActividad = async (actividadId: number, user: any, fecha: any) => {
        const currentActivityWithUser = { actividadId, userId: user.user_id, userName: user.user_name, fecha, observacion: '' }
        let newArray:any;
        if (selectedActividades===null) {
            let arreglo:any = [];
            actividades.map((element:any) => {
                arreglo.push({ actividadId: element.id, userId: user.user_id, userName: user.user_name, fecha, observacion: '' })
            });
            newArray = arreglo;
        } else {
            newArray = selectedActividades ? [...selectedActividades.filter((act: any) => act.actividadId !== currentActivityWithUser.actividadId), currentActivityWithUser] : [currentActivityWithUser]
        }
        setSelectedActividades(newArray);
        setOpenUserModal(false);
    }
    /**
     * Funcion para abrir el modal de requerimientos
     * @param id id del req
     */
    const openModal = (id: number) => {
        const thisReq = myRequirements?.filter(req => Number(req.id) === Number(id))[0];
        setSelectedTask(thisReq ? thisReq : null);

        getArrayOfUsers(thisReq ? thisReq : null);

        setOpen(true);
    }
    const resetEverything = () => {
        setOpen(false);
        setOpenUserModal(false);
        // setRespuestaReq("");
        setSelectedActividades(null);
        setSelectedTask(null);
    }
    /**
     * Funcion para cerrar Modal
     */
    const handleClose = () => {
        setOpen(false);
        resetEverything();
    };

    /**
     * Funcion para obtener los requerimientos
     */
    const getMyRequirements = async () => {
        const token = getCookieValue("token");
        const username = getCookieValue("username");
        const urlUser = `${baseUrl}/validToken`;
        const body = new FormData();
        body.append("token", token);
        body.append("username", username);
        const options = {
            method: "POST",
            body
        }
        try {
            const userResponse = await fetch(urlUser, options)
            const userDataArray = await userResponse.json();
            if (userDataArray.exito === "SI") {
                const userData = userDataArray.usuario;
                if (Number(userData.function_id) !== 2) {
                    router("/requirements/basic");
                    return false;
                }
                const url = `${baseUrl}/listarequerimientos?&status=pendiente`;

                try {
                    const respuesta = await fetch(url);
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        setMyRequirements(data.registros);
                        // console.log(data.registros)
                    } else {
                        setMyRequirements(null);

                        console.log("Ocurrio un error al solicitar la informacion de las tareas", data);
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log({ userDataArray })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const redirect = (path: string) => {
        router(path)
    }

    const getArrayOfUsers = async (selectedTaskParam: IRequirement | null) => {
        if (!selectedTaskParam) {
            return false;
        } else {

            const url = `${baseUrl}/listaactivityusersxproceso?process_id=${selectedTaskParam.process_id}`;
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            setActividades(data.registros.filter((task: any) => selectedTaskParam.process_id === task.id)[0].activities)
        }
    }

    const asignarUsersATareas = async () => {
        setIsSubmitting(true);
        const url = `${baseUrl}/trafico`;
        let activUsers = "";
        if (selectedActividades.length < actividades.length) {
            Swal.fire({
                title: "Error",
                text: "Faltan actividades por asignar",
                icon: "error",
            })
            return false;
        }

        if (!selectedTask) {
            Swal.fire({
                title: "Error",
                text: "Debe seleccionar una actividad valida",
                icon: "error"
            })
            setIsSubmitting(false);
        } else {

            for (let i = 1; i <= selectedActividades.length; i++) {
                const position = i - 1;
                activUsers += i === selectedActividades.length ? `${selectedActividades[position].actividadId}*!*${selectedActividades[position].userId}*!*${selectedActividades[position].fecha}*!*${selectedActividades[position].observacion}` : `${selectedActividades[position].actividadId}*!*${selectedActividades[position].userId}*!*${selectedActividades[position].fecha}*!*${selectedActividades[position].observacion},`
            }
            console.log(activUsers)
            const body = new FormData();
            body.append("case_id", String(selectedTask ? selectedTask.case_id : ''));
            body.append("activ_users", activUsers);
            const options = {
                method: "POST",
                body
            }
            const respuesta = await fetch(url, options)

            const data = await respuesta.json();

            if (data.exito === "SI") {
                Swal.fire({
                    title: "Exito",
                    text: "Se han asignado los usuarios",
                    icon: "success",
                })
                resetEverything();
                getMyRequirements();
                setIsSubmitting(false);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
                setIsSubmitting(false);
            }
        }
    }
    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getMyRequirements();
        setIsLoading(false);
    }, [])

    // Render
    return (
        <Layout title="Tráfico" user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
                    <PageTitle title="Requerimientos para asignar recursos (Tráfico)" />
                    <Button size="small" sx={{ ml: 1, p: 1, height: "100%", borderRadius: 5, textTransform: "none" }} variant="outlined" color="info" onClick={() => redirect("/requirements/basic")} > Ver lista de tareas asignadas a este usuario</Button>
                </Box>
                {isLoading && (
                    <Box sx={{ w: "100%", m: "auto" }}>
                        <CircularProgress color="secondary" />
                    </Box>
                )}
                <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center" spacing={1}>
                    {
                        myRequirements && myRequirements.map(req => (
                            <Grid item key={req.id} xs={12}>
                                <Box sx={{
                                    display: "flex", justifyContent: "space-between", w: "100%", borderRadius: 5, p: 2, flexWrap: "wrap", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                                    background: "rgba(255,255,255,0.6)",
                                    backdropFilter: 'blur(6px)',
                                }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                                        <Typography variant="subtitle1" fontSize={16} fontWeight="bold">Requerimiento #{req.case_id} - {req.process_name} - Cliente: {req.customer_name}</Typography>
                                        <Typography variant="subtitle2" fontSize={12} fontWeight="400" color="text.secondary">{req.description}</Typography>
                                    </Box>
                                    <Button color="secondary" variant="contained" onClick={() => openModal(req.id)} sx={{ p: 1, borderRadius: 3, textTransform: "none", }} disableElevation>Ver más</Button>
                                </Box>
                            </Grid>
                        ))
                    }
                    {
                        !myRequirements && (
                            <Typography variant="body2" color="text.secondary" >No existen tareas asignadas a su usuario por los momentos</Typography>
                        )
                    }
                </Grid>
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { background: "#f5f5f5" } }}>
                    <AppBar sx={{ position: 'relative', boxShadow: "0 8px 32px 0 rgba(100,100,100,0.1)" }} elevation={0}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {selectedTask?.process_name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ width: "80%", m: "10px auto", p: 2 }}>
                        <Box sx={{
                            borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)', p: 2
                        }}>

                            <Typography variant="body1" component="p" fontWeight="bold">
                                Descripcion del requerimiento
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.description}
                            </Typography>
                            <Divider sx={{ marginBlock: 2 }} />
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Proceso
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.process_name}
                            </Typography>
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Encargado del proceso
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.process_owner_name}
                            </Typography>
                            <Divider sx={{ marginBlock: 2 }} />
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Fecha de vencimiento
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.vence}
                            </Typography>
                            <Divider sx={{ marginBlock: 2 }} />
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Briefing
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.briefing}
                            </Typography>
                        </Box>
                        {/* <Button component="a" href={`/briefing/${selectedTask?.case_id}`} target={"_blank"} style={{ borderRadius: 15, boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em", textTransform: "none" }}>Ver Datos del cliente</Button> */}
                        <Button component="a" href={`/client/${selectedTask?.customer_id}`} target={"_blank"} style={{ borderRadius: 15, boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em", textTransform: "none" }}>Ver Datos del cliente</Button>

                        {
                            actividades && actividades.map((act: any) => (
                                <ActivityCard act={act} setOpenUserModal={setOpenUserModal} currentActividad={currentActividad} setCurrentActividad={setCurrentActividad} setSelectedActividades={setSelectedActividades} selectedActividades={selectedActividades} currentFechasVencimiento={currentFechasVencimiento} setCurrentFechasVencimiento={setCurrentFechasVencimiento} />
                            ))
                        }
                        <LoadingButton disabled={selectedActividades && selectedActividades.length < actividades.length} color="secondary" variant="contained" onClick={() => asignarUsersATareas()} loading={isSubmitting} fullWidth sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation >Asignar tareas</LoadingButton>
                    </Box>
                </Dialog>
            </Box>
            {/* Modal de usaurios */}
            <Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition} PaperProps={{ sx: { background: "#f5f5f5" } }}>
                <AppBar sx={{ position: 'relative', boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }} elevation={0}>
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
                    {actividades && currentActividad ? actividades.filter((act: any) => Number(act.id) === Number(currentActividad.id))[0].users.map((usuario: any) => (
                        <Box key={usuario.user_id} sx={{ p: 2, borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                            <Box>
                                <Typography>{usuario.user_name}</Typography>
                                <Typography>{usuario.function_name}</Typography>
                                <Typography>Disponible en {5} horas</Typography>
                            </Box> 
                            <Button color="secondary" variant="contained" sx={{ textTransform: "none", background: 'black', color: 'white', borderRadius: 3, p: 1 }} onClick={() => selectuserDeActividad(currentActividad.id, usuario, currentActividad.fecha)}>Seleccionar</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog>
        </Layout>
    )
}
const MyActionBar = ({
    onAccept,
    onCancel,
}: PickersActionBarProps) => {

    return (
        <DialogActions>
            <Button sx={{ textTransform: "none" }} onClick={onCancel} color="error"> Cancelar </Button>
            <Button sx={{ textTransform: "none" }} onClick={onAccept} color="secondary"> Seleccionar </Button>
        </DialogActions>
    );
};
interface ActivityCardProps {
    act: any;
    setOpenUserModal: (value: React.SetStateAction<boolean>) => void;
    setCurrentActividad: (value: any) => void;
    selectedActividades: any;
    currentActividad: any,
    currentFechasVencimiento: any;
    setCurrentFechasVencimiento: React.Dispatch<any>;
    setSelectedActividades: React.Dispatch<any>;
}
const ActivityCard: FC<ActivityCardProps> = ({ act, setOpenUserModal, currentActividad, setCurrentActividad, selectedActividades, setSelectedActividades, setCurrentFechasVencimiento, currentFechasVencimiento }) => {

    const [edit, setEdit] = useState<boolean>(false);
    const [editObs, setEditObs] = useState<boolean>(false);
    const [observacion, setObservacion] = useState<string>('');
    const [fecha, setFecha] = useState<any>(act.vencimiento_estimado);
    const [newFecha, setNewFecha] = useState<Moment | null>(
        moment(),
    );
    const handleChangeFecha = (newValue: Moment | null) => {
        setNewFecha(newValue);
        setFecha(moment(newValue).format("YYYY-MM-DD HH:mm:ss"));
    };
    const save = () => {
        const excludeFechas = currentFechasVencimiento && currentFechasVencimiento.filter((f: any) => f.id !== act.actividadId);
        const newFechas = excludeFechas ? [...excludeFechas, { id: act.actividadId, vencimiento_estimado: fecha }] : [{ id: act.actividadId, vencimiento_estimado: fecha }];
        const prevSelected = selectedActividades.filter((sa: any) => sa.actividadId === act.id).length > 0 ? selectedActividades.filter((sa: any) => sa.actividadId === act.id)[0] : false;
        const excludeSelectedActividades = prevSelected ? selectedActividades.filter((s: any) => s.actividadId !== act.id) : false;
        const newActividad = excludeSelectedActividades ? { actividadId: prevSelected.actividadId, userId: prevSelected.userId, userName: prevSelected.userName, fecha } : false;
        const newSelectedActividades = excludeSelectedActividades ? [...excludeSelectedActividades, newActividad] : selectedActividades;
        newSelectedActividades.sort((a: any, b: any) => a.actividadId - b.actividadId)
        setCurrentFechasVencimiento(newFechas)
        setSelectedActividades(newSelectedActividades);
        setEdit(false);
    }
    const handleChangeObs = (e: ChangeEvent<HTMLInputElement>) => {
        setObservacion(e.target.value);
    }

    const saveObs = () => {

        const prevSelected = selectedActividades.filter((sa: any) => sa.actividadId === act.id).length > 0 ? selectedActividades.filter((sa: any) => sa.actividadId === act.id)[0] : false;
        const excludeSelectedActividades = prevSelected ? selectedActividades.filter((s: any) => s.actividadId !== act.id) : false;
        const newActividad = excludeSelectedActividades ? { actividadId: prevSelected.actividadId, userId: prevSelected.userId, userName: prevSelected.userName, fecha, observacion } : false;
        const newSelectedActividades = excludeSelectedActividades ? [...excludeSelectedActividades, newActividad] : selectedActividades;
        newSelectedActividades.sort((a: any, b: any) => a.actividadId - b.actividadId)
        setSelectedActividades(newSelectedActividades);
        setEditObs(false);
    }
    return (
        <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>
            <Box key={act.id} sx={{ borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", display: "flex", flexFlow: "row wrap", p: 3, mb: 2, justifyContent: "space-between", alignItems: "center", }}>
                <Box sx={{ display: "flex", flexFlow: "column wrap", mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">#{act.id}</Typography>
                    <Typography>{act.activity_name}</Typography>
                    <Box>
                        {edit ? (
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                <IconButton onClick={() => setEdit(false)} color="error"><EditOffIcon /></IconButton>
                                <DateTimePicker
                                    label="Fecha de vencimiento"
                                    value={newFecha}
                                    onChange={handleChangeFecha}
                                    OpenPickerButtonProps={{ color: "secondary" }}
                                    components={{
                                        ActionBar: MyActionBar
                                    }}
                                    renderInput={(params: any) => <TextField color="secondary" {...params} fullWidth variant="outlined" />}
                                />
                                <IconButton onClick={save} color="success" ><SaveIcon /></IconButton>
                            </Box>
                        ) : (<Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <Typography variant="subtitle2" color="text.secondary">Vence {fecha}</Typography>
                            <IconButton onClick={() => setEdit(true)} > <EditIcon /></IconButton>
                        </Box>)}
                        {editObs ? (
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>

                                <IconButton onClick={() => setEditObs(false)} color="error"><EditOffIcon /></IconButton>
                                <TextField label="Observacion" multiline fullWidth color="secondary" variant="outlined" value={observacion} onChange={handleChangeObs} />
                                <IconButton onClick={saveObs} color="success" ><SaveIcon /></IconButton>
                            </Box>
                        ) : (<Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <Typography variant="subtitle2" color="text.secondary">Observacion: {observacion}</Typography>
                            <IconButton onClick={() => setEditObs(true)} > <EditIcon /></IconButton>
                        </Box>)}
                    </Box>
                    {
                        selectedActividades && selectedActividades.filter((activitySelected: any) => activitySelected.actividadId === act.id).length > 0 ? (<>
                            <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
                                <Typography variant="subtitle2">Usuario asignado: {selectedActividades.filter((act3: any) => act3.actividadId === act.id)[0].userName}</Typography>
                            </Box>
                        </>
                        ) : (<></>)
                    }
                </Box>
                <Button color="secondary" variant="contained" sx={{ textTransform: "none", borderRadius: 3, p: 1 }} disableElevation size="small" onClick={() => {
                    setOpenUserModal(true);
                    setCurrentActividad({ id: act.id, fecha: fecha });
                }}>Seleccionar usuario</Button>
            </Box>
        </LocalizationProvider>
    )
}