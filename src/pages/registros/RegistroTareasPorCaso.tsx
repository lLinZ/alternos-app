import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Grid, MenuItem, Select, Typography, SelectChangeEvent, IconButton } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import AttachFileIcon from '@mui/icons-material/AttachFile';
const columns = [
    {
        name: 'Descripción',
        selector: (row: IData) => row.descriptioncase,
        sortable: true,
    },
    {
        name: 'Proceso',
        selector: (row: IData) => row.process_name,
        sortable: true,
    },
    {
        name: 'Actividad',
        selector: (row: IData) => row.activity_name,
        sortable: true,
    },
    {
        name: 'Inicio',
        selector: (row: IData) => String(row.inicio),
        sortable: true,
    },
    {
        name: 'Vence',
        selector: (row: IData) => String(row.vence),
        sortable: true,
    },
    {
        name: 'Comentario de cierre',
        selector: (row: IData) => row.comentario_cierre,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: IData) => row.status,
        sortable: true,
    },
    {
        cell: (row: IData) => <IconButton component="a" href={row.url} target="_blank" color="success"><AttachFileIcon /></IconButton>,
        button: true,
        sortable: false,
        allowOverflow: true,
        ignoreRowClick: true
    },
];
interface IData {
    id: number;
    case_id: number;
    descriptioncase: string;
    user_id: number;
    user_name: string;
    description: string;
    process_id: number;
    process_name: string;
    process_owner_id: number;
    process_owner_name: string;
    activity_id: number;
    activity_name: string;
    activity_owner_id: number;
    activity_owner_name: string;
    status: string;
    inicio: any;
    vence: string;
    completed_at: any;
    comentario_cierre: string;
    archivo: string;
    url: string;
}

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroTareasPorCasoPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [analisis, setAnalisis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [empty, setEmpty] = useState<boolean>(false)
    const [casos, setCasos] = useState<any>(null);
    const [caso, setCaso] = useState<any>(0);
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
    const getAnalisis = async (caseId: string | number) => {
        setIsLoading(true);
        setEmpty(false);
        console.log(caseId)
        const url = `${baseUrl}/listatareasxcaso?case_id=${caseId}`
        const options = {
            method: "GET",
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                setAnalisis(data.registros);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setAnalisis(null);
                setEmpty(true);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setAnalisis(null);
            setEmpty(true);
        }
    }
    const getCasos = async () => {
        const url = `${baseUrl}/listacasos`
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (data.exito === "SI") {
            setCasos(data.registros)
        }
    }
    const handleChange = (e: SelectChangeEvent) => {
        setCaso(e.target.value);
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getCasos();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"} >Registro de tareas por caso</Typography>
                <Grid container spacing={1}>
                    {
                        casos && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>

                                    <Select color="secondary" defaultValue={"0"} value={caso !== 0 ? caso : "0"} onChange={handleChange} sx={{ "& fieldset": { borderRadius: 0 } }}>
                                        <MenuItem disabled value={"0"}>Seleccione un caso</MenuItem>
                                        {
                                            casos.map((u: any) => <MenuItem key={u.id + u.description} value={String(u.id)}>{u.description}</MenuItem>)
                                        }
                                    </Select>
                                    <Button sx={{ borderRadius: 0, p: 2, }} disableElevation color="secondary" variant="contained" onClick={() => getAnalisis(caso)}>Buscar</Button>
                                </Box>
                            </Grid>
                        )
                    }
                    {
                        analisis && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={analisis}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !analisis && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">Seleccione un caso y clickee en &quot;Buscar&quot;</Typography>
                            </Grid>
                        )
                    }
                    {
                        isLoading && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <CircularProgress sx={{ mr: 2 }} color="info" />
                                    <Typography variant="subtitle2" fontWeight={"bold"}>Cargando...</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                    {
                        empty && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <Typography variant="subtitle2" color="error" fontWeight={"bold"}>Este caso no tiene tareas pendientes...</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
        </Layout>
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