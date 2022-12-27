import { LoadingButton } from '@mui/lab';
import { Switch, Box, Typography, CircularProgress, Grid, Button, Dialog, AppBar, Toolbar, IconButton, Divider, TextField, Slide, Chip } from '@mui/material';
import { ChangeEvent, FC, forwardRef, ReactElement, Ref, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { getCookieValue, validarToken } from '../lib/functions';
import { IRequirement } from './UserRequirementsPage';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TransitionProps } from '@mui/material/transitions';
import { PageTitle } from '../components/ui';

interface Props {

}

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
export const BasicTaskPage: FC<Props> = () => {

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


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const ref = useRef<HTMLInputElement>(null)

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

    /**
     * Funcion para abrir el modal de requerimientos
     * @param id id del req
     */
    const openModal = (id: number) => {
        const thisReq = myRequirements?.filter(req => Number(req.id) === Number(id))[0];
        setUserSelected(null);
        setSelectedTask(thisReq ? thisReq : null);
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
    /**
     * Funcion para cerrar Modal
     */
    const handleClose = () => {
        setOpen(false);
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
                // const url = `${baseUrl}/listatareas?owner_id=${userData.id}&status=pendiente`;
                const url = `${baseUrl}/listatareasusuario?owner_id=${userData.id}`;
                console.log(url)
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
     * Funcion para enviar la respuesta de la tarea
     */
    const onSubmit = async () => {
        setIsSubmitting(true);

        if (!selectedTask || !respuestaReq) {
            Swal.fire({
                text: "Error",
                title: "Todos los campos son obligatorios",
                icon: "error"
            })
            setIsSubmitting(false);
        } else {
            const url = `${baseUrl}/respuesta`
            const body = new FormData();

            body.append("task_id", String(selectedTask?.id));
            body.append("respuesta", String(respuestaReq));
            body.append("archivo", selectedFile ? selectedFile : '');
            console.log({ task_id: String(selectedTask?.id), respuesta: respuestaReq, selectedFile })
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
                    setSelectedFile(null);
                    // Alert
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha respondido el requerimiento",
                        icon: "success",
                    })
                    console.log(data)
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data.mensaje,
                        icon: "error",
                    });
                    setIsSubmitting(false);
                    setOpen(false);
                }
            } catch (err) {
                Swal.fire({
                    title: "Error",
                    text: "No se logró conectar al servidor",
                    icon: "error",
                });
                setIsSubmitting(false);
            }
        }
    }
    const changeStatus = async (id: number, status: 'en proceso' | 'pendiente') => {
        const url = `${baseUrl}/cambiastatustarea`;

        console.log('id',id);
        console.log('status',status);

        const body = new FormData();

        body.append('task_id', String(id));
        body.append('status', String(status));
        console.log({ status })
        const options = {
            method: "POST",
            body
        }

        try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();
            console.log(id, status);
            if (data.exito === "SI") {
                Swal.fire({
                    title: "Cambió el status",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    position: 'bottom-start'
                })
                getMyRequirements();
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
            }
        } catch (error) {

            Swal.fire({
                title: "No cambió el status",
                icon: "error",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: 'bottom-start'
            })
            console.log(error);
        }

    }
    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getMyRequirements();
        setIsLoading(false);
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <PageTitle title="Tareas abiertas" />

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
                                    background: "rgba(255,255,255,0.6)",
                                    boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                                    display: "flex",
                                    flexFlow: "row wrap",
                                    justifyContent: "space-between",
                                    borderRadius: 5,
                                    p: 2,
                                    width: "100%",
                                    alignItems: "center"
                                }}>

                                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                            <Chip size="small" sx={{ boxShadow: `0 0 10px ${req.status === 'pendiente' ? 'rgba(245, 176, 65)' : 'rgba(52, 152, 219)'}` }} label={`${req.status.substring(0, 1).toUpperCase()}${req.status.substring(1).toLowerCase()}`} color={req.status === 'pendiente' ? 'warning' : 'info'} />
                                            <Switch color="info" inputProps={{ 'aria-label': 'switch' }} defaultChecked checked={req.status === 'en proceso' ? true : false} onChange={() => changeStatus(req.id, req.status === 'pendiente' ? 'en proceso' : 'pendiente')} />
                                        </Box>
                                        <Typography variant="subtitle1" fontSize={16} fontWeight="bold">Tarea #{req.id} - {req.description} ({req.activity_name})</Typography>
                                        <Typography variant="subtitle2" fontSize={12} fontWeight="400" color="text.secondary">Requerimiento #{req.case_id} - {req.descriptioncase}</Typography>
                                    </Box>
                                    <Button disableElevation color="secondary" variant="contained" onClick={() => openModal(req.id)} sx={{ p: 2, textTransform: "none", borderRadius: 3 }}>Ver más</Button>
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
                    <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(255,255,255,0.6)", }} elevation={0}>
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
                            <Button autoFocus color="inherit" onClick={handleClose}>

                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ width: "80%", m: "20px auto" }}>
                        <Box sx={{
                            borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)', p: 3
                        }}>

                            <Typography variant="body1" component="p" fontWeight="bold">
                                Descripcion del requerimiento
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.description}
                            </Typography>
                            <Divider sx={{ marginBlock: 2 }} />
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Actividad
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.activity_name}
                            </Typography>
                            <Typography variant="body1" component="p" fontWeight="bold">
                                Encargado de la actividad
                            </Typography>
                            <Typography variant="body1" component="p">
                                {selectedTask?.activity_owner_name}
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
                        {/* <Button component="a" href={`/briefing/${selectedTask?.case_id}`} target={"_blank"} style={{
                            borderRadius: 15, padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)',
                        }}>Ver Brief</Button> */}
                        <Button 
                            component="a" href={`/client/${selectedTask?.customer_id}`} target={"_blank"} style={{
                            borderRadius: 15, padding: "1em", textDecoration: "none", color: "black", width: "100%", marginTop: "0.5em", marginBottom: "0.5em", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)',
                        }}>Ver Datos del cliente</Button>
                        {
                            selectedFile && (
                                <>
                                    <Typography variant="overline">Nombre de archivo de resultado</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">{selectedFile.name}</Typography>
                                </>
                            )
                        }
                        <Button type="button" variant="contained" color={selectedFile ? "success" : "info"} fullWidth sx={{
                            textTransform: "none",
                            p: 1.8,
                            borderRadius: 5,
                            marginBlock: 1,
                            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
                        }} onClick={() => ref !== null && ref.current?.click()}>{selectedFile ? 'Cambiar archivo' : 'Seleccionar Archivo'}</Button>

                        <input
                            ref={ref as any}
                            type="file"
                            style={{ display: "none" }}
                            accept={"image/*"}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSelectedFile(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                e.target.value = "";
                            }}
                        />
                        <TextField label="Comentario de cierre de tarea" fullWidth value={respuestaReq} onChange={(e: ChangeEvent<HTMLInputElement>) => setRespuestaReq(e.currentTarget.value)} multiline color="secondary" InputProps={{ sx: { borderRadius: 3 } }} sx={{
                            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)', borderRadius: 3, mt: 2, mb: 2, input: { border: "none" }, "& fieldset": { border: "none" }
                        }} />
                        <LoadingButton color="secondary" variant="contained" onClick={() => onSubmit()} loading={isSubmitting} fullWidth sx={{
                            p: 2, borderRadius: 5, textTransform: "none", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)'
                        }} disableElevation>Tarea completada</LoadingButton>
                    </Box>
                </Dialog>
            </Box >
            {/* Modal de usaurios */}
            < Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition} >
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
                    {users ? users.map((usuario: any) => (
                        <Box key={usuario.user_id} sx={{ p: 2, borderRadius: "10px", border: "1px solid black", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Typography>{usuario.user_name}</Typography>
                            <Button color="secondary" onClick={() => {
                                setUserSelected({ id: usuario.user_id, name: usuario.user_name })
                                setOpenUserModal(false);
                            }}>Seleccionar</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog >
        </Layout >
    )
}

