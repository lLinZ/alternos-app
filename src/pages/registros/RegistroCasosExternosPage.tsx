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
import CloseIcon from '@mui/icons-material/CancelRounded';
import RedoIcon from '@mui/icons-material/Redo';
import { Case } from '../../interfaces/requirement-type';
import Swal from 'sweetalert2';
import { ExternalCase } from '../../interfaces/externalcase-type';

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroCasosExternosPage: FC = () => {
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
        const url = `${baseUrl}/listacasosexternos`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setCasos(data.registros);
        }
    }
    const closeCase = async (id: number) => {
        const url = `${baseUrl}/cambiastatuscasosexternos`
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
                    text: "No se logró cerrar el requerimiento",
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
            selector: (row: ExternalCase) => row.description,
            sortable: true,
        },
        {
            name: 'Nombre del proceso',
            selector: (row: ExternalCase) => row.process_name,
            sortable: true,
        },
        {
            name: 'Usuario asignado',
            selector: (row: ExternalCase) => row.user_name,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row: ExternalCase) => row.status,
            sortable: true,
        },
        {
            cell: (row: ExternalCase) => <IconButton onClick={() => closeCase(row.id)} color="success"><CloseIcon /></IconButton>,
            name: "Cerrar requerimiento",
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
                <PageTitle title="Registro de externos" />
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