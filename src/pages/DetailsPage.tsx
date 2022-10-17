import { ChangeEvent, FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'

import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'
import DataTable, { createTheme } from 'react-data-table-component';




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
const data: IData[] = [
    {
        id: 1,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 2,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 3,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 4,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 5,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 6,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 7,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 8,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 9,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 10,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 11,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 12,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 13,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 14,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 15,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 16,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 17,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 18,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 19,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 20,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 21,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 22,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 23,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 24,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
    {
        id: 25,
        name: 'Proceso 1',
        costo: '188',
        precio: '200',
    },
    {
        id: 26,
        name: 'Proceso 2',
        costo: '350',
        precio: 260,
    },
    {
        id: 27,
        name: 'Proceso 3',
        costo: 150,
        precio: 32,
    },
    {
        id: 28,
        name: 'Proceso 4',
        costo: '250',
        precio: '100',
    },
]
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const DetailsPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [procesos, setProcesos] = useState<any>(data)

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
    const handleChangeDatos = (options: number) => {
        switch (options) {
            case 1:
                setProcesos([{
                    id: 24,
                    name: 'Proceso 4',
                    costo: '250',
                    precio: '100',
                },
                {
                    id: 25,
                    name: 'Proceso 1',
                    costo: '188',
                    precio: '200',
                },
                {
                    id: 26,
                    name: 'Proceso 2',
                    costo: '350',
                    precio: 260,
                },
                {
                    id: 27,
                    name: 'Proceso 3',
                    costo: 150,
                    precio: 32,
                },
                {
                    id: 28,
                    name: 'Proceso 4',
                    costo: '250',
                    precio: '100',
                },])
                break;
            case 2:
                setProcesos([{
                    id: 24,
                    name: 'Proceso 4',
                    costo: '250',
                    precio: '100',
                },
                {
                    id: 25,
                    name: 'Proceso 1',
                    costo: '188',
                    precio: '200',
                },
                {
                    id: 26,
                    name: 'Proceso 2',
                    costo: '350',
                    precio: 260,
                },])
                break;
            case 3:
                setProcesos(data);
                break;
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);

    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"} fontSize={16}>Registros</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="overline">Buscar registros por fecha</Typography>
                        <Box sx={styles.searchContainer}>

                            <Box sx={styles.fromToContainer}>
                                <TextField label="Desde" value={from} onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }} />
                                <Divider orientation='vertical' />
                                <TextField label="Hasta" value={to} onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textAlign: "right" } }} />
                            </Box>
                            <Button variant="contained" color="secondary" sx={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} disableElevation>Buscar</Button>
                        </Box>

                        <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%" }}>
                            <IconButton onClick={() => handleChangeDatos(1)} sx={{ width: 40, height: 40 }}>1</IconButton>
                            <IconButton onClick={() => handleChangeDatos(2)} sx={{ width: 40, height: 40 }}>2</IconButton>
                            <IconButton onClick={() => handleChangeDatos(3)} sx={{ width: 40, height: 40 }}>3</IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <DataTable
                            columns={columns}
                            data={procesos}
                            customStyles={customStyles}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                        />
                    </Grid>
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