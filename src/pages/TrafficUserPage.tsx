import { LoadingButton } from "@mui/lab";
import { Box, Typography, CircularProgress, Grid, Button, Dialog, AppBar, Toolbar, IconButton, Divider, TextField, Slide } from "@mui/material";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface SelectedUser {
    id: number;
    name: string;
}
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
    const [respuestaReq, setRespuestaReq] = useState<string>("");

    // Control del modal de usuarios
    const [openUserModal, setOpenUserModal] = useState<boolean>(false);

    // Usuarios buscados
    const [users, setUsers] = useState<User[] | null>(null);

    // Usuario seleccionado
    const [userSelected, setUserSelected] = useState<SelectedUser | null>(null)

    // Funcion del siguiente usuario al actual
    const [followingFunction, setFollowingFunction] = useState<number | null>(null);

    // Ultimo usaurio de las actividades
    const [last, setLast] = useState<boolean>(false);
    const [listabeta, setListabeta] = useState<any>(null);

    const [actividades, setActividades] = useState<any>(null);

    const [usersModal, setUsersModal] = useState<any>(null);

    const [selectedActividades, setSelectedActividades] = useState<any>(null);

    const [currentActividad, setCurrentActividad] = useState<any>(null)
    const plantilla = [
        {
            actividad_id: 1,
            user_id: 2,
        }
    ]

    // Router
    const router = useNavigate();

    /**
     * Funcion para obtener los usuarios por id de funcion
     * @param functionId ID de la funcion del usuario siguiente al actual
     */
    const getUsers = async (functionId: number) => {
        const url = `${baseUrl}/listausersxfunction?function_id=${functionId}`
        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                setUsers(data.registros[0].users)
            } else {
                setUsers(null);
                console.log("No se logro encontrar ningún usuario")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const selectuserDeActividad = async (actividadId: number, user: any) => {
        const currentActivityWithUser = { actividadId, userId: user.user_id, userName: user.user_name }
        const newArray = selectedActividades ? [...selectedActividades.filter((act: any) => act.actividadId !== currentActivityWithUser.actividadId), currentActivityWithUser] : [currentActivityWithUser]
        setSelectedActividades(newArray);
        setOpenUserModal(false);
    }

    const deselectUserDeActividad = async (actividadId: number) => {
        const newArray = selectedActividades.filter((act: any) => actividadId !== act.actividadId)

        setSelectedActividades(newArray);
    }

    /**
     * Funcion para abrir el modal de requerimientos
     * @param id id del req
     */
    const openModal = (id: number) => {
        const thisReq = myRequirements?.filter(req => Number(req.id) === Number(id))[0];
        setUserSelected(null);
        setSelectedTask(thisReq ? thisReq : null);
        getArrayOfUsers(thisReq ? thisReq : null);
        // getFollowingFunction(thisReq ? thisReq.process_id : 0);

        setOpen(true);
    }
    /**
     * Funcion para abrir modal de usaurios
     */
    const openModalUser = () => {
        if (!followingFunction) return;

        setOpenUserModal(true);
        getUsers(followingFunction!);
    }

    /**
     * Funcion para reinciar los datos del formulario 
     */
    const resetModal = () => {
        setSelectedTask(null);
        setOpen(false);
        setOpenUserModal(false);
        setUserSelected(null);
        setFollowingFunction(null);
        setRespuestaReq("")
    }
    const resetEverything = () => {
        setOpen(false);
        setOpenUserModal(false);
        setRespuestaReq("");
        setSelectedActividades(null);
        setSelectedTask(null);
        setUserSelected(null);
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
                console.log(userDataArray)

                try {
                    const respuesta = await fetch(url);
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        setMyRequirements(data.registros);
                        console.log(data.registros)
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

    /**
     * Funcion para obtener la funcion siguiente a la de trafico
     */
    const getFollowingFunction = async (selectedTaskProcessId: number) => {
        const url = `${baseUrl}/listaprocesos?id_proceso=${selectedTaskProcessId}`;

        try {

            const respuesta = await fetch(url);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                const actividadesActuales = data.registros[0].actividades;

                let match = false;
                let siguiente = 0;
                const len = actividadesActuales.length;
                let counter = 1;
                for (let actividadActual of actividadesActuales) {
                    counter++;
                    if (match === true) {
                        siguiente = actividadActual.owner_id;
                        setFollowingFunction(siguiente);
                        match = false;
                        break;
                    } else {
                        if (counter === len) {
                            setLast(true);
                        }
                    }

                    if (Number(actividadActual.owner_id) === Number(userLogged?.function_id)) {
                        match = true;
                    }
                }
            } else {
                console.log({ data });
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })
            }
        } catch (err) {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: "Error al conectar con el servidor",
                icon: "error"
            })

        }
    }

    const redirect = (path: string) => {
        router(path)
    }

    /**
     * Funcion para enviar la respuesta de la tarea
     */
    const onSubmit = async () => {
        setIsSubmitting(true);

        if (!userSelected || !selectedTask || !respuestaReq) {
            Swal.fire({
                text: "Error",
                title: "Todos los campos son obligatorios",
                icon: "error"
            })
            setIsSubmitting(false);
        } else {
            const url = `${baseUrl}/asignatarea`
            const body = new FormData();

            body.append("task_id", String(selectedTask?.id));
            body.append("respuesta", String(respuestaReq));
            !last && body.append("task_assigned_id", String(userSelected.id));

            const options = {
                method: "POST",
                body
            }

            try {

                // Solicitud
                const respuesta = await fetch(url, options);
                // Datos de la respuesta
                const data = await respuesta.json();

                // Si tuvo exito
                if (data.exito === "SI") {

                    // Se elimina la tarea actual del array de requerimientos
                    const newRequirements: IRequirement[] | null = myRequirements?.filter(req => req.id !== selectedTask?.id) || null;

                    // Se actualiza el array de req
                    setMyRequirements(newRequirements);

                    // Se obtienen los requerimientos nuevos
                    getMyRequirements();
                    // Se reinician los campos
                    resetModal();

                    // Cancel loader
                    setIsSubmitting(false);

                    // Alert
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha respondido el requerimiento",
                        icon: "success",
                    })
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se logró responder el requerimiento",
                        icon: "error",
                    });
                    setIsSubmitting(false);
                }
            } catch (err) {
                Swal.fire({
                    title: "Error",
                    text: "No se logró conectar al servidor",
                    icon: "error",
                });
                console.log(err);
                setIsSubmitting(false);
            }
        }
    }
    const getArrayOfUsers = async (selectedTaskParam: IRequirement | null) => {
        if (!selectedTaskParam) {
            return false;
        } else {

            const url = `${baseUrl}/listaactivityusersxproceso?process_id=${selectedTaskParam.process_id}`;
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            console.log(data.registros.filter((task: any) => selectedTaskParam.process_id === task.id)[0].activities)
            setActividades(data.registros.filter((task: any) => selectedTaskParam.process_id === task.id)[0].activities)
        }
    }

    const asignarUsersATareas = async () => {
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
        } else {

            for (let i = 1; i <= selectedActividades.length; i++) {
                const position = i - 1;
                activUsers += i === selectedActividades.length ? `${selectedActividades[position].actividadId}:${selectedActividades[position].userId}` : `${selectedActividades[position].actividadId}:${selectedActividades[position].userId},`
            }
            const body = new FormData();
            body.append("case_id", String(selectedTask ? selectedTask.case_id : ''));
            body.append("activ_users", activUsers);
            const options = {
                method: "POST",
                body
            }
            console.log({ case_id: selectedTask.case_id, activUsers })
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
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
            }
        }
    }
    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getMyRequirements();
        setIsLoading(false);
    }, [])
    console.log(selectedActividades)
    // Render
    return (
        <Layout title="Tráfico" user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                    <Typography variant="overline" component="h2" fontWeight="bold" sx={{ mb: 2 }} fontSize={16}>Tareas abiertas (Tráfico)</Typography>
                    <Button size="small" sx={{ ml: 1, p: 1, height: "100%", borderRadius: 5, textTransform: "none" }} variant="outlined" color="info" onClick={() => redirect("/requirements/basic")} > Ver lista de tareas comunes</Button>
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
                                        <Typography variant="subtitle1" fontSize={16} fontWeight="bold">{req.process_name} #{req.case_id}</Typography>
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
                        </Box>
                        <Button component="a" href={`/briefing/${selectedTask?.case_id}`} target={"_blank"} style={{ borderRadius: 15, boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", background: "#FFF", padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em", textTransform: "none" }}>Ver Brief</Button>
                        {
                            actividades && actividades.map((act: any) => (
                                <Box key={act.id} sx={{ borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", display: "flex", flexFlow: "row wrap", p: 3, mb: 2, justifyContent: "space-between", alignItems: "center", }}>
                                    <Box sx={{ display: "flex", flexFlow: "column wrap", mb: 2 }}>

                                        <Typography>{act.activity_name}</Typography>
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
                                        setCurrentActividad(act.id);
                                    }}>Seleccionar usuario</Button>
                                </Box>
                            ))
                        }
                        <LoadingButton disabled={selectedActividades && selectedActividades.length < actividades.length} color="secondary" variant="contained" onClick={() => asignarUsersATareas()} loading={isSubmitting} fullWidth sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation >Responder tarea</LoadingButton>
                    </Box>
                </Dialog>
            </Box>
            {/* Modal de usaurios */}
            <Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition} PaperProps={{ sx: { background: "#f5f5f5" } }}>
                <AppBar sx={{ position: 'relative' }} elevation={0}>
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
                    {actividades && currentActividad ? actividades.filter((act: any) => Number(act.id) === Number(currentActividad))[0].users.map((usuario: any) => (
                        <Box key={usuario.user_id} sx={{ p: 2, borderRadius: 5, background: "#FFF", boxShadow: "0 8px 32p 0 rgba(100,100,100,0.2)", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                            <Typography>{usuario.user_name}</Typography>
                            <Button color="secondary" onClick={() => selectuserDeActividad(currentActividad, usuario)}>Seleccionar</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog>
        </Layout>
    )
}
