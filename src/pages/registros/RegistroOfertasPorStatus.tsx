import { FC, useEffect, useState, ChangeEvent } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { PageTitle } from '../../components/ui';

const columns = [
    {
        name: 'ID',
        selector: (row: IData) => row.id,
        sortable: true,
    },
    {
        name: 'Vendedor',
        selector: (row: IData) => row.salesman_name,
        sortable: true,
    },
    {
        name: 'Cliente',
        selector: (row: IData) => row.customer_name,
        sortable: true,
    },
    {
        name: 'Fecha',
        selector: (row: IData) => String(row.fecha),
        sortable: true,
    },
    {
        name: 'Precio',
        selector: (row: IData) => row.precio_oferta,
        sortable: true,
    },
    {
        name: 'Costo',
        selector: (row: IData) => row.costo_oferta,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: IData) => row.status,
        sortable: true,
    },
];
interface IData {
    costo_oferta: number;
    created_at: Date;
    customer_id: number;
    customer_name: string;
    fecha: Date;
    id: number;
    items: Item[];
    precio_oferta: number;
    salesman_id: number;
    salesman_name: string;
    status: string;
}
interface Item {
    costo: number;
    description: string;
    item_id: number;
    precio: number;
    product_id: number;
    status: string;
    type: string;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroOfertasPorStatusPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [ofertas, setOfertas] = useState<any>(null)
    const [status, setStatus] = useState<string>('0');

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
    const getOfertas = async (status = '') => {
        const url = `${baseUrl}/listaofertas?status=${status}`
        try {

            const respuesta = await fetch(url);
            const data = await respuesta.json();
            console.log(data);
            if (data.exito === "SI") {
                setOfertas(data.registros);
            }
        } catch (error) {

        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newStatus = event?.target.value

        getOfertas(newStatus)
        setStatus(newStatus);
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getOfertas();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Registro de ofertas por status" />

                <TextField label="Status" value={status} onChange={handleChange} color="secondary" variant="outlined" fullWidth sx={{ "& fieldset": { borderRadius: 3 }, borderRadius: 3, background: "#FFF", marginBlock: 2 }} select>
                    <MenuItem value={'0'} disabled>Seleccione un status</MenuItem>
                    <MenuItem value={''}>Todas</MenuItem>
                    <MenuItem value={'aprobada'}>Aprobada</MenuItem>
                    <MenuItem value={'rechazada'}>Rechazada</MenuItem>
                    <MenuItem value={'enviada'}>Enviada</MenuItem>
                    <MenuItem value={'confirmada'}>Confirmada</MenuItem>
                    <MenuItem value={'nueva'}>Nueva</MenuItem>
                    <MenuItem value={'anulada'}>Anulada</MenuItem>
                </TextField>
                <Grid container spacing={1}>
                    {
                        ofertas && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={ofertas}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !ofertas && (
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


