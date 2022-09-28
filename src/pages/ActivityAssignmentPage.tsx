import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react'

import { AppBar, Box, Button, Dialog, Grid, IconButton, Popover, Slide, Toolbar, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/layout'
import { validarToken } from '../lib/functions';
import InfoIcon from '@mui/icons-material/HelpRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { User } from '../interfaces/user-type';
import { baseUrl } from '../common/baseUrl';
import Swal from 'sweetalert2';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Activity {
    id: number;
    name: string;
}
interface Process {
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
    formulario: string;
}
interface SelectedProcess {
    id: number;
    name: string
}
interface SelectedActivity {
    id: number;
    name: string;
    orden: number;
}
export const ActivityAssignmentPage = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const [procesos, setProcesos] = useState<Process[] | null>(null);
    const [selectedProcess, setSelectedProcess] = useState<SelectedProcess | null>(null);
    const [modalProcesos, setModalProcesos] = useState<boolean>(false);

    const [actividades, setActividades] = useState<Activity[] | null>(null);
    const [modalActividades, setModalActividades] = useState<boolean>(false);
    const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[] | null>(null);

    const [orden, setOrden] = useState<number>(0)

    const router = useNavigate();

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const getProcesos = async () => {
        const url = `${baseUrl}/listaprocesos`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setProcesos(data.registros);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
    const getActividades = async () => {
        const url = `${baseUrl}/listaactividades?id_activity=&id_owner=`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setActividades(data.actividades);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
    const openModalActividades = () => {
        setModalActividades(true);
    }
    const openModalProcesos = () => {
        setModalProcesos(true);
    }
    const selectProcess = (id: number, name: string) => {
        setSelectedProcess({
            id,
            name
        });
        setModalProcesos(false);
    }
    const selectActivity = (id: number, name: string) => {
        const exists = Boolean(selectedActivities?.filter(act => act.id === id).length)
        const newActivities = exists
            ? (selectedActivities?.filter(act => act.id !== id))
            : (selectedActivities ? [...selectedActivities, { id, name, orden: orden + 1 }] : [{ id, name, orden: orden + 1 }]);

        setSelectedActivities(newActivities!);
        exists ? setOrden(orden - 1) : setOrden(orden + 1);
    }

    const onSubmit = async () => {
        const errores = [];
        if (!selectedActivities) {
            errores.push("Debe seleccionar minimo 1 actividad");
        }
        if (!selectedProcess) {
            errores.push("Debe seleccionar un proceso");
        }
        if (errores.length > 0) {
            Swal.fire({
                title: "Error",
                html: errores.map(err => `- ${err} </br>`),
                icon: "error"
            })
            return false;
        } else {
            const url = `${baseUrl}/actividadesxproceso`;
            const body = new FormData();
            let activitiesId = ""
            const len = selectedActivities?.length
            for (let i = 1; i <= len!; i++) {
                const position = i - 1;
                if (selectedActivities !== null) {
                    activitiesId += i === len ? `${selectedActivities[position].id}` : `${selectedActivities[position].id},`
                }
            }
            body.append("process_id", String(selectedProcess ? selectedProcess.id : 0));
            body.append("activities", String(activitiesId));
            const options = {
                method: "POST",
                body
            }
            try {
                const respuesta = await fetch(url, options);
                const data = await respuesta.json();
                if (data.exito === "SI") {
                    Swal.fire({
                        title: "Exito",
                        text: "Se ha registrado exitosamente el proceso",
                        icon: "success",
                    })
                    setSelectedActivities(null);
                    setSelectedProcess(null);
                    setOrden(0);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data.mensaje,
                        icon: "error",
                    })
                    return false;
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "No se logró conectar al servidor",
                    icon: "error",
                })
                console.log(error);
            }
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getProcesos();
        getActividades();
    }, [])
    return (

        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Asignacion de actividades</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} >
                        <Button color="secondary" variant="outlined" fullWidth sx={{ p: 1.8 }} onClick={openModalProcesos}>
                            Seleccionar proceso
                        </Button>
                    </Grid>
                    {
                        selectedProcess && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px", p: 2 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="overline" fontWeight={400} >Proceso Seleccionado</Typography>
                                        <Typography variant="subtitle1" fontWeight={500} >{selectedProcess.name}</Typography>
                                    </Box>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <Button color="secondary" variant="outlined" fullWidth sx={{ p: 1.8 }} onClick={openModalActividades}>
                            Seleccionar actividades
                        </Button>
                    </Grid>
                    {
                        selectedActivities && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "left", alignItems: "left", borderRadius: "10px", p: 2, flexDirection: "column" }}>
                                    {
                                        selectedActivities.map((activity: SelectedActivity) => (
                                            <>
                                                <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                                                    <Typography variant="overline" fontWeight={400} >Actividad #{activity.orden}</Typography>
                                                    <Typography variant="subtitle1" fontWeight={500} >{activity.name}</Typography>
                                                </Box>
                                            </>
                                        ))
                                    }
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <Button color="secondary" variant="contained" fullWidth sx={{ p: 1.8 }} onClick={onSubmit}>
                            Registrar nuevo Proceso
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Dialog onClose={() => setModalActividades(false)} fullScreen open={modalActividades} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                            <InfoIcon color="info" />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Actividades
                        </Typography>
                        <Button
                            color="success"
                            variant="outlined"
                            onClick={() => setModalActividades(false)}
                            size="small"
                        >
                            Guardar
                        </Button>
                        <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Box sx={{ p: 2 }}>
                                <Typography sx={{ p: 1, textAlign: "justify" }}>La última actividad seleccionada tendrá color verde, indicando que puede ser deseleccionada, esto es así para mantener el orden de las actividades.
                                    Puedes deseleccionar las actividades clickeando en el orden en que las seleccionaste pero de manera invertida.</Typography>
                            </Box>

                        </Popover>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {actividades && actividades.map((activity: Activity) => (
                        <Box key={activity.id} sx={{ p: 2, borderRadius: "10px", border: "1px solid rgba(0,0,0,0.3)", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="subtitle1" fontWeight={500}>{activity.name}</Typography>
                            </Box>
                            <IconButton size="small" color="secondary" onClick={() => selectActivity(activity.id, activity.name)} disabled={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length)}>
                                {Boolean(selectedActivities?.filter(act => act.id === activity.id).length) ? (<>{selectedActivities?.filter(act => act.id === activity.id)[0].orden}<CheckCircleIcon color={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length) ? "secondary" : "success"} /></>) : (<CircleIcon />)}
                            </IconButton>
                        </Box>))}
                </Box>
            </Dialog>
            <Dialog onClose={() => setModalProcesos(false)} fullScreen open={modalProcesos} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setModalProcesos(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Proceso
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {procesos && procesos.map((process: Process) => (
                        <Box key={process.id} sx={{ p: 2, borderRadius: "10px", border: "1px solid rgba(0,0,0,0.3)", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="subtitle1" fontWeight={500}>{process.name}</Typography>
                            </Box>
                            <IconButton size="small" color="secondary" disabled={selectedProcess?.id === process.id} onClick={() => selectProcess(process.id, process.name)}>{selectedProcess?.id === process.id ? (<CheckCircleIcon color="success" />) : (<CircleIcon />)}</IconButton>
                        </Box>))}
                </Box>
            </Dialog>
        </Layout>
    )
}
