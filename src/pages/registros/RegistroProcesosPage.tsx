import { ChangeEvent, FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable, { createTheme } from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';

const columns = [
    {
        name: 'Nombre',
        selector: (row: IData) => row.name,
        sortable: true,
    },
    {
        name: 'Costo',
        selector: (row: IData) => row.costo,
        sortable: true,
    },
    {
        name: 'Precio',
        selector: (row: IData) => row.precio,
        sortable: true,
    },
];
interface IData {
    id: number;
    name: string;
    costo: string | number;
    precio: string | number;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroProcesosPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [procesos, setProcesos] = useState<any>(null)

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
    const getProcesos = async () => {
        const url = `${baseUrl}/listaprocesos`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setProcesos(data.registros);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getProcesos();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"} fontSize={16}>Registro de procesos</Typography>
                <Grid container spacing={1}>
                    {/* <Box sx={styles.searchContainer}>
                        {/* <Typography variant="overline">Buscar registros por fecha</Typography> */}
                    {/* </Grid>
                            <Box sx={styles.fromToContainer}>
                                <TextField label="Desde" value={from} onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }} />
                                <Divider orientation='vertical' />
                                <TextField label="Hasta" value={to} onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textAlign: "right" } }} />
                            </Box>
                            <Button variant="contained" color="secondary" sx={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} disableElevation>Buscar</Button>
                        </Box> */}
                    {
                        procesos && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={procesos}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !procesos && (
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