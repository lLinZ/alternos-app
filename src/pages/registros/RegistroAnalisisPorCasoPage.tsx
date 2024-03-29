import React, { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Grid, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { PageTitle } from '../../components/ui';
import moment from 'moment';

const columns = [
    {
        name: 'Tarea',
        selector: (row: IData) => row.activity_name,
        sortable: true,
        width: "19rem"
    },
    {
        name: 'Usuario asignado',
        selector: (row: IData) => row.user_name,
        sortable: true,
        width: "12rem"
    },
    {
        name: 'Status',
        selector: (row: IData) => row.status,
        sortable: true,
        width: "9rem"
    },
    {
        name: 'Inicio planificado',
        selector: (row: IData) => `${moment(row.inicio).format("DD-MM-YYYY HH:mm")}`,
        sortable: true,
        width: "9.5rem"
    },
    {
        name: 'Fin planificado',
        selector: (row: IData) => `${moment(row.vence).format("DD-MM-YYYY HH:mm")}`,
        sortable: true,
        width: "9.5rem"
    },
    {
        name: 'Duración (min)',
        selector: (row: IData) => row.duration,
        sortable: true,
        right: true,
        width: "9rem"
    },
    {
        name: 'Inicio real',
        selector: (row: IData) => (row.inicio_real==='0000-00-00 00:00:00') ? "" : `${moment(row.inicio_real).format("DD-MM-YYYY HH:mm")}`,
        sortable: true,
        width: "9.5rem"
    },
    {
        name: 'Fin real',
        selector: (row: IData) => (row.fin_real==='0000-00-00 00:00:00') ? "" : `${moment(row.fin_real).format("DD-MM-YYYY HH:mm")}`,
        sortable: true,
        width: "9.5rem"
    },
    {
        name: 'Dur. real (min)',
        selector: (row: IData) => row.duration_real,
        sortable: true,
        right: true,
        width: "9rem"
    },
];
interface IData {
    activity_name: string;
    inicio: string | number;
    vence: string | number;
    duration: string | number;
    user_name: string;
    status: string | number;
    inicio_real: string | number;
    fin_real: string | number;
    duration_real: string | number;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroAnalisisPorCasoPage: FC = () => {
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
        const url = `${baseUrl}/analisiscasosabiertos`
        const body = new FormData();

        body.append("case_id", String(caseId))
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                setAnalisis(data.registros[0].activities);
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
                <PageTitle title="Analisis por requerimiento" />
                <Grid container spacing={1}>
                    {
                        casos && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>

                                    <Select color="secondary" defaultValue={"0"} value={caso !== 0 ? caso : "0"} onChange={handleChange} sx={{ "& fieldset": { borderRadius: 0 } }} style={{ width: "1000px" }}>
                                        <MenuItem disabled value={"0"} style={{ width: "1000px" }}>Seleccione un requerimiento</MenuItem>
                                        {
                                            casos.map((u: any) => <MenuItem key={u.id + u.description} value={String(u.id)} style={{ width: "1000px" }}>(#{u.id}) {u.description}</MenuItem>)
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
                                <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">Seleccione un requerimiento y clickee en &quot;Buscar&quot;</Typography>
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
                                    <Typography variant="subtitle2" color="error" fontWeight={"bold"}>Este requerimiento no tiene tareas pendientes...</Typography>
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