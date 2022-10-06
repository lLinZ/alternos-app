import { FC, useEffect, useState, forwardRef, ReactElement, Ref } from "react";

import { AppBar, Box, Button, Dialog, Grid, IconButton, Slide, TextField, Toolbar, Typography } from "@mui/material";

import { Layout } from "../components/layout"
import { validarToken } from "../lib/functions";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../common/baseUrl";
import { LoadingButton } from "@mui/lab";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from "sweetalert2";

interface Props { }

interface SelectedDepartment {
    id: number;
    name: string;
}
interface Departments {
    id: number;
    name: string;
}
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ProcessesPage: FC<Props> = () => {

    // Usuario logeado
    const [userLogged, setUserLogged] = useState();

    // Abrir modal
    const [open, setOpen] = useState(false);

    // Departamentos registrados
    const [departments, setDepartments] = useState<Departments[] | null>(null);

    // Usuario seleccionado
    const [selectedDepartment, setSelectedDepartment] = useState<SelectedDepartment | null>(null);

    // Procesos
    const [process, setProcess] = useState<string>("");

    // Control Enviando formulario
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Router
    const router = useNavigate();


    const onSubmit = async () => {
        setIsSubmitting(true);
        if (!process || !selectedDepartment) {
            Swal.fire({
                title: "Error",
                text: "Faltan campos",
                icon: "error",
            })
            setIsSubmitting(false);
        } else {

            const url = `${baseUrl}/procesos`;

            const body = new FormData();

            body.append("name", process);
            body.append("owner_id", String(selectedDepartment.id));
            console.log({ name: process, owner_id: selectedDepartment.id })
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                console.log(data)
                if (data.exito === "SI") {
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha registrado un proceso nuevo",
                        icon: "success",
                    })
                    setSelectedDepartment(null);
                    setProcess("");
                    setIsSubmitting(false);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data.mensaje,
                        icon: "error",
                    })
                    setIsSubmitting(false);
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: "No se logró conectar con el servidor",
                    icon: "error",
                })
                setIsSubmitting(false);
            }
        }
    }
    /**
     * Funcion para obtener usuarios
     */
    const getDepartments = async () => {
        const url = `${baseUrl}/listafunctions`
        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                setDepartments(data.registros)
            } else {
                setDepartments(null);
                console.log("No se logro encontrar ningún usuario")
            }
        } catch (error) {
            console.log(error);
        }
    }



    /**
     * Funcion para seleccionar un usuario
     * @param id ID del usaurio seleccionado
     * @param name Nombre del usuario seleccionado
     */
    const selectDepartment = (id: number, name: string) => {
        setSelectedDepartment({
            id,
            name,
        })
        setOpen(false);
    }

    /**
     * Funcion para abrir modal
     */
    const openModal = () => {
        setOpen(true);
    }


    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getDepartments();
        // getInformation();
    }, []);

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography variant="overline" fontSize={16} fontWeight="bold" sx={{ mb: 2 }}>Registrar proceso</Typography>
                <Grid container display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flexDirection="row" spacing={1}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Nombre" name="name" color="secondary" onChange={(e) => setProcess(e.target.value)} value={process} InputProps={{ sx: { borderRadius: 5 } }} sx={{ background: "#FFF", borderRadius: 5, input: { border: "none" } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Centro de costo 1" name="costouno" color="secondary" onChange={(e) => setProcess(e.target.value)} value={process} InputProps={{ sx: { borderRadius: 5 } }} sx={{ background: "#FFF", borderRadius: 5, input: { border: "none" } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Centro de costo 2" name="costodos" color="secondary" onChange={(e) => setProcess(e.target.value)} value={process} InputProps={{ sx: { borderRadius: 5 } }} sx={{ background: "#FFF", borderRadius: 5, input: { border: "none" } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => openModal()} color="secondary" fullWidth sx={{ p: 1.8, borderRadius: 5, background: "#FFF", border: "none" }} type="button" disableElevation>Buscar departamento</Button>
                    </Grid>
                    {
                        selectedDepartment && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFF", borderRadius: 5, p: 2, "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="subtitle1" fontWeight={500} >{selectedDepartment.name}</Typography>
                                    </Box>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <LoadingButton fullWidth loading={isSubmitting} color="secondary" variant="contained" sx={{ p: 2, mt: 2, borderRadius: 5, textTransform: "none" }} disableElevation onClick={() => onSubmit()}>Registrar proceso</LoadingButton>
                    </Grid>
                </Grid>
            </Box>

            {/* Modal de seleccion de usuario  */}
            <Dialog onClose={() => setOpen(false)} open={open} fullScreen TransitionComponent={Transition} PaperProps={{ sx: { background: "#f5f5f5" } }}>
                <AppBar sx={{ position: 'relative' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar departamento
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {departments && departments.map((department: { id: number; name: string; }) => (
                        <Box key={department.id} sx={{ p: 2, borderRadius: 5, background: "#FFF", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="subtitle1" fontWeight={500} >{department.name}</Typography>
                            </Box>
                            <Button color="secondary" sx={{ borderRadius: 5, textTransform: "none", p: 1.8 }} disableElevation variant="contained" disabled={selectedDepartment?.id === department.id} onClick={() => selectDepartment(department.id, department.name)}>{selectedDepartment?.id === department.id ? "Seleccionado" : "Seleccionar"} {selectedDepartment?.id === department.id && (<CheckCircleIcon color="success" />)}</Button>
                        </Box>))}
                </Box>
            </Dialog>
        </Layout>
    )
}