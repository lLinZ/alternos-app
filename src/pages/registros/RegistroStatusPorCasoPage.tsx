import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Grid, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';

const columns = [
    {
        name: 'Descripcion',
        selector: (row: IData) => row.description,
        sortable: true,
    },
    {
        name: 'Tareas totales',
        selector: (row: IData) => row.total_tareas,
        sortable: true,
    },
    {
        name: 'Tareas completadas',
        selector: (row: IData) => row.total_completadas,
        sortable: true,
    },
    {
        name: 'Efectividad',
        selector: (row: IData) => row.efectividad,
        sortable: true,
    },
];
interface IData {
    description: number;
    total_tareas: string | number;
    total_completadas: string | number;
    efectividad: string | number;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroStatusPorCasoPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [Cumplimiento, setCumplimiento] = useState<any>(null)

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
    const getCumplimiento = async () => {
        const url = `${baseUrl}/statusporcaso`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setCumplimiento(data.registros);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getCumplimiento();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"}>Registro de Status por caso</Typography>
                <Grid container spacing={1}>
                    {
                        Cumplimiento && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={Cumplimiento}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !Cumplimiento && (
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