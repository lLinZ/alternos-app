import { ChangeEvent, FC, Dispatch, SetStateAction, useState, useEffect, forwardRef, ReactElement, Ref } from 'react';
import { Box, Typography, IconButton, Collapse, Alert, Grid, TextField, Button, Dialog, AppBar, Toolbar, CircularProgress, useTheme, Slide, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ProcessesModal } from '../requirements/ProcessesModal';
import HelpIcon from "@mui/icons-material/HelpRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import Swal from 'sweetalert2';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import { useNavigate } from 'react-router-dom';
import { ISelectedProcess } from '../../interfaces/process-type';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TransitionProps } from '@mui/material/transitions';

interface Props {
    // open: boolean;
    // setOpen: Dispatch<SetStateAction<boolean>>;
    // isSubmitting: boolean;
    // setIsSubmitting: Dispatch<SetStateAction<boolean>>;
    // users: User[] | null;
    userLogged: User | null;
    // userSelected: User | null;
    // setUserSelected: Dispatch<SetStateAction<User | null>>;
    // selectedProcess: string;
    // description: string;
}
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export const WidgetRequirement: FC<Props> = ({ userLogged }) => {
    const [selectedProcess, setSelectedProcess] = useState<ISelectedProcess | null>(null);
    const [description, setDescription] = useState<string>("");
    const [userSelected, setUserSelected] = useState<{ id: number; name: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [openUserModal, setOpenUserModal] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [users, setUsers] = useState<User[] | null>(null);
    const theme = useTheme();
    const router = useNavigate();
    const handleModalUser = () => {
        getUsers(2);
        setOpenUserModal(true);
    }
    /**
* Funcion para obtener los usuarios por id de funcion
* @param functionId ID de la funcion del usuario siguiente al actual
*/
    const getUsers = async (functionId: number) => {
        setUserSelected(null);
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
    const onSubmit = async () => {
        setIsSubmitting(true);
        const url = `${baseUrl}/requerimiento`;
        let errores = [];

        if (!userLogged || !userLogged.id) {
            errores.push("El id del usuario logeado es obligatorio");
        }
        if (!selectedProcess || !selectedProcess.id) {
            errores.push("El id del proceso es obligatorio");
        }
        if (!description) {
            errores.push("La descripcion es obligatoria");
        }
        if (!userSelected) {
            errores.push("Debe seleccionar un usuario");
        }
        if (errores.length > 0) {
            Swal.fire({
                title: "Error",
                html: errores.map(error => `- ${error} </br>`),
                icon: "error"
            })
            setIsSubmitting(false);
        } else {
            const body = new FormData();
            body.append("user_id", String(userLogged ? userLogged.id : ''));
            body.append("process_id", String(selectedProcess ? selectedProcess.id : ''));
            body.append("description", String(description));
            body.append("task_assigned_id", String(userSelected?.id));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                console.log(data)
                if (data.exito === "SI") {
                    router(`/briefing/new/${data.registros[0].process_id}/${data.registros[0].id}`);
                } else {
                    Swal.fire({ title: "Error", text: data.mensaje, icon: "error" })
                    setIsSubmitting(false);
                }
            } catch (error) {
                console.log(error);
                Swal.fire({ title: "Error", text: "No se logró conectar con el servidor", icon: "error" })
                setIsSubmitting(false);
            }
        }
    }
    return (

        <Box display="flex" flexDirection="column" sx={{
            overflowY: "scroll", background: theme.palette.common.white, borderRadius: 5, transition: ".3s ease all", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)', "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, m: 1, p: 2, minHeight: 250, maxHeight: 500,
            '&::-webkit-scrollbar': {
                width: '0.2em',
                height: "10px",
                borderRadius: "10px"
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: "none",
                webkitBoxShadow: "none"
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid rgba(255,255,255,0.2)',
                borderRadius: "10px",
                height: "10px"
            }
        }}>
            <Typography variant="overline" component="h2" fontWeight="bold" >Requerimiento
                {!open && (<IconButton onClick={() => setOpen(prev => !prev)} sx={{ transition: ".5s ease all" }} color="info">
                    <HelpIcon />
                </IconButton>
                )
                }
            </Typography>
            <Box sx={{ w: "100%" }}>
                <Collapse in={open} sx={{ transition: ".5s ease all" }}>
                    <Alert variant="filled" severity="info" sx={{ mb: 2 }} action={<IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    }>
                        En este widget podrás describir tu requerimiento con una descripción específica, seleccionar un proceso y enviarlo para nosotros revisarlo y solucionar tus necesidades lo más pronto posible!
                    </Alert>
                </Collapse>
            </Box>

            <Grid container display="flex" justifyContent="start" alignItems="start" spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Descripcion"
                        name="description"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.currentTarget.value)}
                        variant="outlined"
                        color="secondary"
                        InputProps={{ sx: { borderRadius: 3 } }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12}>
                    <ProcessesModal buttonColor="secondary" selectedProcess={selectedProcess} setSelectedProcess={setSelectedProcess} setUserSelected={setUserSelected} />
                </Grid>
                {
                    selectedProcess && (
                        <>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between ", alignItems: "center", p: 1 }}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={"bold"}>Proceso seleccionado</Typography>
                                        <Typography variant="subtitle2" fontWeight={400}>{selectedProcess.name}</Typography>
                                    </Box>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Button color="secondary" sx={{ boxShadow: "0 0 5px rgba(0,0,0,0.1)", p: 1, borderRadius: 3, textTransform: "none" }} fullWidth onClick={handleModalUser} >Seleccionar Usuario</Button>
                            </Grid>
                            {/* Modal de usaurios */}
                            <Dialog onClose={() => setOpenUserModal(false)} open={openUserModal} fullScreen TransitionComponent={Transition} PaperProps={{ sx: { background: "#F5F5F5" } }}>
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
                                    {users ? users.map((usuario: any) => (
                                        <Box key={usuario.user_id} sx={{ p: 2, borderRadius: 5, m: 1, display: "flex", background: "#FFF", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                                            <Typography>{usuario.user_name}</Typography>
                                            <Button variant="contained" disabled={Number(userSelected?.id) === Number(usuario.user_id)} color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation onClick={() => {
                                                setUserSelected({ id: usuario.user_id, name: usuario.user_name })
                                                setOpenUserModal(false);
                                            }}>Seleccionar</Button>
                                        </Box>)) : <CircularProgress color="secondary" />}
                                </Box>
                            </Dialog>
                        </>
                    )
                }
                {
                    userSelected && (
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between ", alignItems: "center", p: 1, width: "100%" }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={"bold"}>Usuario seleccionado para la actividad</Typography>
                                    <Typography variant="subtitle2" fontWeight={400}>{userSelected.name}</Typography>
                                </Box>
                                <CheckCircleIcon color="success" />
                            </Box>
                        </Grid>
                    )
                }
                <Grid item xs={12}>
                    <LoadingButton sx={{ p: 1, borderRadius: 3, textTransform: "none" }} disableElevation loading={isSubmitting} fullWidth color="secondary" variant="contained" onClick={() => onSubmit()} disabled={!userSelected}>Enviar</LoadingButton>
                </Grid>
            </Grid>
        </Box >
    )
}