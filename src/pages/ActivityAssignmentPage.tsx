import { FC, forwardRef, ReactElement, Ref, useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from 'react'

import { AppBar, Box, Button, Divider, Dialog, Grid, IconButton, MenuItem, Popover, Slide, Toolbar, Typography, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/layout'
import { validarToken } from '../lib/functions';
import InfoIcon from '@mui/icons-material/HelpRounded';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { User } from '../interfaces/user-type';
import { baseUrl } from '../common/baseUrl';
import Swal from 'sweetalert2';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { ActivityModal } from '../components/activity/ActivityModal';
import { Activity, SelectedActivity } from '../interfaces/activity-type';
import { PageTitle } from '../components/ui';
import { FilterBox } from '../components/data/FilterBox';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Process {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    owner_name: string;
    formulario: string;
}
interface SelectedProcess {
    id: number;
    name: string
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
            console.log(url);
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
                    activitiesId += i === len ? `${selectedActivities[position].id}:${selectedActivities[position].precedencia}` : `${selectedActivities[position].id}:${selectedActivities[position].precedencia},`
                }
            }
            console.log(selectedProcess?.id, activitiesId);
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

    const activityModalProps = { actividades, setActividades, selectedActivities, setSelectedActivities, orden, setOrden, modalActividades, setModalActividades }

    return (

        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center", mb: 1 }}>
                    <PageTitle title="Asignacion de actividades" />
                    <IconButton onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                        <InfoIcon color="info" />
                    </IconButton>

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
                            <Typography sx={{ p: 1, textAlign: "justify" }}>Debe seleccionar el proceso al que quiere asignar las actividades. Si el proceso ya tiene actividades asignadas, entonces las seleccionadas reemplazarán a las anteriores.</Typography>
                        </Box>

                    </Popover>
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} >
                        <Button color="secondary" fullWidth sx={{ background: "#FFF", borderRadius: 5, p: 1.8, boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", textTransform: "none" }} onClick={openModalProcesos}>
                            Seleccionar proceso
                        </Button>
                    </Grid>
                    {
                        selectedProcess && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "column wrap", justifyContent: "left", alignItems: "left", p: 2, background: "#FFF", borderRadius: 5, "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                                    <Typography variant="overline" fontWeight="bold">Proceso Seleccionado</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Typography variant="subtitle1" fontWeight={500} >{selectedProcess.name}</Typography>
                                        <CheckCircleIcon color="success" />
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <Button color="secondary" fullWidth sx={{ background: "#FFF", borderRadius: 5, p: 1.8, boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", textTransform: "none" }} onClick={openModalActividades}>
                            Seleccionar actividades
                        </Button>
                    </Grid>
                    {
                        selectedActivities && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "left", alignItems: "left", background: "#FFF", borderRadius: 5, p: 2, flexDirection: "column", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}>
                                    <Typography variant="overline" fontWeight="bold">Actividades a asignar</Typography>
                                    {
                                        selectedActivities.map((activity: SelectedActivity) => (
                                            <>
                                                <ActivityCard activity={activity} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                                                {/* <Box sx={{ display: "flex", flexDirection: "column", mt: 2, }}>
                                                    <Typography variant="overline" fontWeight={400} >Actividad #{activity.orden}</Typography>
                                                    <Typography variant="subtitle1" fontWeight={500} >{activity.name}</Typography>
                                                </Box> */}
                                            </>
                                        ))
                                    }
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12} >
                        <Button color="secondary" variant="contained" fullWidth sx={{ borderRadius: 5, p: 2, textTransform: "none" }} onClick={onSubmit}>
                            Registrar nuevo proceso
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <ActivityModal {...activityModalProps} />
            <Dialog onClose={() => setModalProcesos(false)} fullScreen open={modalProcesos} TransitionComponent={Transition} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(255,255,255,0.6)", }} elevation={0}>
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
                    {procesos && (<FilterBox data={procesos} setData={setProcesos} category1="name" category2='owner_name' category3='description' />)}
                    {procesos && procesos.map((process: Process) => (
                        <Box key={process.id} sx={{ p: 3, borderRadius: 5, mb: 2, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(255,255,255,0.4)" }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="subtitle1" >{process.name}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" >{process.description}</Typography>
                            </Box>
                            <IconButton size="small" color="secondary" disabled={selectedProcess?.id === process.id} onClick={() => selectProcess(process.id, process.name)}>{selectedProcess?.id === process.id ? (<CheckCircleIcon color="success" />) : (<CircleIcon />)}</IconButton>
                        </Box>))}
                </Box>
            </Dialog>
        </Layout>
    )
}


interface ActivityCardProps {
    activity: SelectedActivity;
    selectedActivities: SelectedActivity[] | null;
    setSelectedActivities: Dispatch<SetStateAction<SelectedActivity[] | null>>;
}
const ActivityCard: FC<ActivityCardProps> = ({ activity, selectedActivities, setSelectedActivities }) => {
    const [innerPrecedencia, setInnerPrecedencia] = useState<number>(0);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const excludeActivities = selectedActivities?.filter((a) => a.id !== activity.id);
        const newActivity = { id: activity.id, name: activity.name, orden: activity.orden, precedencia: Number(event.target.value), duration: 0 };
        const newActivities = excludeActivities ? [...excludeActivities, newActivity] : [newActivity];
        newActivities.sort((a: any, b: any) => a.orden - b.orden);
        setInnerPrecedencia(Number(event.target.value));
        setSelectedActivities(newActivities)
    }
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
                    <Typography variant="overline" fontWeight={400} >Actividad #{activity.orden}</Typography>
                    <Typography variant="subtitle1" fontWeight={500} >{activity.name}</Typography>
                </Box>
                <TextField
                    color="secondary"
                    value={innerPrecedencia}
                    label="Precedencia"
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 100 }}
                    select
                >
                    <MenuItem value={0}>0</MenuItem>
                    {
                        selectedActivities && selectedActivities.map((sa, i) => (
                            (i+1 !== activity.orden) && <MenuItem value={i + 1} key={sa.id}>{i + 1}</MenuItem>
                        )
                        )
                    }
                </TextField>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}