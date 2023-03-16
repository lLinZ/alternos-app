import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageTitle } from '../../components/ui';
import moment from 'moment';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import Swal from 'sweetalert2';
interface IData {
    id: number;
    description: string;
    vence: string;
    inicio: string;
    status: string;
    duration: string;
    inicio_real: string;
    fin_real: string;
    duration_real: string;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroCasosPage: FC = () => {
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
        const url = `${baseUrl}/listacasos`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setCasos(data.registros);
        }
    }
    // selector: (row: IData) => `${row.inicio} (${   formatDistanceToNow(Date.parse(row.inicio), { locale: es })})`,

    const columns = [
        // {
        //     name: 'ID',
        //     selector: (row: IData) => row.id,
        //     sortable: true,
        //     width: '4rem'
        // },
        {
            name: 'Descripcion',
            selector: (row: IData) => `(#${row.id}) ${row.description}`,
            sortable: true,
            width: '25rem'
        },
        {
            name: 'Status',
            selector: (row: IData) => row.status,
            sortable: true,
            maxWidth: '10rem'
        },
        {
            name: 'Planificado (Inicio / Fin / Horas)',
            selector: (row: IData) => `${moment(row.inicio).format("DD-MM-YYYY HH:mm:ss")} / ${moment(row.vence).format("DD-MM-YYYY HH:mm:ss")} / ${row.duration}`,
            sortable: true,
            width: '20rem'
        },
        {
            name: 'Real (Inicio / Fin / Horas)',
            selector: (row: IData) => `${moment(row.inicio_real).format("DD-MM-YYYY HH:mm:ss")} / ${moment(row.fin_real).format("DD-MM-YYYY HH:mm:ss")} / ${row.duration_real}`,
            sortable: true,
            width: '20rem'
        },
    ];

    useEffect(() => {
        validarToken(router, setUserLogged);
        getCasos();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Lista de Requerimientos" />
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
        width: '90%',
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