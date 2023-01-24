import { Dispatch, FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Button, Chip, CircularProgress, Dialog, Grid, IconButton, Switch, Toolbar, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { ucfirst, validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageTitle } from '../../components/ui';
import CloseIcon from '@mui/icons-material/Close';
import RedoIcon from '@mui/icons-material/Redo';
import { Case } from '../../interfaces/requirement-type';
import Swal from 'sweetalert2';

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};
interface Caso {
    id: number;
    description: string;
    user_id: number;
    user_name: string;
    process_id: number;
    process_name: string;
    process_owner_id: number;
    process_owner_name: string;
    status: string;
    inicio: Date;
    vence: Date;
    tareas: Tarea[];
    completed_at: string;
    comentario_cierre: string;
}
interface Tarea {
    activity_id: number;
    activity_name: string;
    archivo1: string;
    archivo2: string;
    archivo3: string;
    comentario_cierre: string;
    completed_at: Date;
    description: string;
    inicio: Date;
    observaciones: string;
    status: string;
    task_id: number;
    user_id: number;
    user_name: string;
}
export const RegistroCasosCerradosPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [caso, setCaso] = useState<Caso | null>(null)
    const [tareas, setTareas] = useState<Tarea[] | null>(null)
    const [casos, setCasos] = useState<Caso[] | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [switches, setSwitches] = useState<any[]>([])

    const customStyles = {
        rows: {
            style: {
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e5e5e5',
                },
            },
            stripedStyle: {
            },
        },
    }
    const getCasos = async () => {
        const url = `${baseUrl}/listacasos?status=completado`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setCasos(data.registros);
        }
    }

    const abrirModal = (id: number) => {
        const newCaso = casos?.filter((c: Caso) => c.id === id)[0];
        setOpen(true);
        setTareas(newCaso ? newCaso.tareas : null);
        setCaso(newCaso ? newCaso : null);
    }
    const reabrir = async (id: number) => {
        const url = `${baseUrl}/abreocierracaso`
        const body = new FormData();
        body.append("case_id", String(id));
        body.append("status", "abierto");
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                console.log({ data })
                Swal.fire({
                    title: "Exito",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    position: "bottom-start"
                })
                getCasos();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró reabrir el requerimiento",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                })
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "No se logró conectar al servidor",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
            })
        }
    }
    const columns = [
        {
            name: 'Descripcion',
            selector: (row: Case) => row.description,
            sortable: true,
        },
        {
            name: 'Fecha de Inicio',
            selector: (row: Case) => `${row.inicio} (${formatDistanceToNow(parseISO(String(row.inicio)), { locale: es })})`,
            sortable: true,
        },
        {
            name: 'Fecha de Vencimiento',
            selector: (row: Case) => `${row.vence} (${formatDistanceToNow(parseISO(String(row.vence)), { locale: es })})`,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row: Case) => row.status,
            sortable: true,
        },
        {
            cell: (row: Case) => <IconButton onClick={() => abrirModal(row.id)} color="success"><RedoIcon /></IconButton>,
            name: "Reabrir requerimiento",
            button: true,
            allowOverflow: true,
            ignoreRowClick: true
        },
    ];
    useEffect(() => {
        validarToken(router, setUserLogged);
        getCasos();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Registro de Requerimientos cerrados" />
                <Grid container spacing={1}>
                    {
                        casos && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={casos}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !casos && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <CircularProgress sx={{ mr: 2 }} color="info" />
                                    <Typography variant="subtitle2" fontWeight={"bold"}>Cargando...</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
            <ModalReapertura switches={switches} getCasos={getCasos} setSwitches={setSwitches} setOpen={setOpen} open={open} caso={caso} tareas={tareas} />
        </Layout>
    )
}
interface PropsModal {
    open: boolean;
    setOpen: Dispatch<any>;
    caso: Caso | null;
    tareas: Tarea[] | null;
    switches: any[];
    setSwitches: Dispatch<any>;
    getCasos: () => void;
}

const ModalReapertura: FC<PropsModal> = ({ setOpen, open, caso, tareas, switches, setSwitches, getCasos }) => {
    const reabrir = async () => {
        const url = `${baseUrl}/abreocierracaso`
        const body = JSON.stringify({
            case_id: caso?.id,
            status: 'abierto',
            tareas: [...switches]
        })
        const options = {
            method: "POST",
            body
        }
        console.log(body);
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                console.log({ data })
                Swal.fire({
                    title: "Exito",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    position: "bottom-start"
                })
                getCasos();
                handleClose();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró reabrir el requerimiento",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                })
                handleClose();
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "No se logró conectar al servidor",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
            })
            handleClose();
        }
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = (id: number) => {
        const newValue = switches.filter((a) => a === id);
        if (newValue.length > 0) {
            const exclude = switches.filter((a) => a !== id);
            setSwitches(exclude)
        } else {
            setSwitches(switches && switches.length > 0 ? [...switches, id] : [id])
        }
    }
    return (
        <Dialog fullScreen open={open} onClose={handleClose} PaperProps={{
            sx: {
                background: "#f1f1f1"
            }
        }}>
            <AppBar sx={{ position: 'relative' }} elevation={0}>
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
                        Seleccion de tareas (Reabrir)
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ margin: "20px auto", width: "80%" }}>
                {/* {JSON.stringify(switches)} */}
                {tareas && tareas.map((t) => (
                    <Box key={t.activity_id} sx={{ width: "100%", borderRadius: 3, boxShadow: "0 0 8px rgba(0,0,0,0.1)", background: "#FFF", p: 2, mb: 2 }}>
                        <Box>
                            <Chip color="info" label={ucfirst(t.status)} />
                            <Switch color="info" onChange={() => handleChange(t.task_id)} inputProps={{ 'aria-label': 'controlled' }} checked={switches.filter((a) => a === t.activity_id)[0]} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">{t.activity_name}</Typography>
                        <Typography variant="subtitle2">{t.user_name}</Typography>
                    </Box>
                ))}

                <Button color="secondary" sx={{ p: 1.8, borderRadius: 3, textTransform: 'none' }} variant='contained' disableElevation fullWidth onClick={reabrir}>Reabrir caso</Button>
            </Box>
        </Dialog>
    )
}
const styles = {
    mainContainer: {
        minHeight: "100vh",
        width: '80%',
        margin: "20px auto",
        position: "relative"
    },
    searchContainer: {
        display: "flex",
        flexFlow: "column wrap",
        width: "100%",
    },
    inputSearch: {
        border: "none",
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: "#FFF",
        boxShadow: "0 0 2px rgba(0,0,0,0.1)",
        "& fieldset": {
            transition: "1s ease all",
            border: "none",
        },
        "&:hover > fieldset": { border: "1px solid black" },

    },
    fromToContainer: {
        display: "flex",
        flexFlow: "row nowrap",
    },
    button: {
        textTransform: "none",
        p: 2,
        borderRadius: 5
    }

}