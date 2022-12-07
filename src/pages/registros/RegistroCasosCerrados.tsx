import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageTitle } from '../../components/ui';
import { BatterySaverOutlined } from '@mui/icons-material';
import RedoIcon from '@mui/icons-material/Redo';
import { Case } from '../../interfaces/requirement-type';
import Swal from 'sweetalert2';

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroCasosCerradosPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [casos, setCasos] = useState<any>(null)

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
    const reabrir = async (id: number) => {
        const url = `${baseUrl}/abreocierracaso`
        const body = new FormData();
        body.append("case_id", String(id));
        body.append("status", "abierto");
        const options = {
            method: "POST",
            body
        }
        console.log(id)
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
                    text: "No se logró reabrir el caso",
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
            cell: (row: Case) => <IconButton onClick={() => reabrir(row.id)} color="success"><RedoIcon /></IconButton>,
            name: "Reabrir caso",
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
                <PageTitle title="Registro de Casos cerrados" />
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