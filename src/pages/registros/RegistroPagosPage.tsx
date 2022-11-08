import { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Grid, IconButton, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { ThumbDownRounded, ThumbUpRounded } from '@mui/icons-material';
import Swal from 'sweetalert2';


interface IData {
    trx_id: number;
    monto: number;
    user_name: string;
    formapago: string | number;
    referencia: string | number;
    concepto: string | number;
    fecha: string | number;
    status: string | number;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroPagosPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [Pagos, setPagos] = useState<any>(null)
    const columns = [
        {
            name: 'Usuario',
            selector: (row: IData) => row.user_name,
            sortable: true,
        },
        {
            name: 'Forma de pago',
            selector: (row: IData) => row.formapago,
            sortable: true,
        },
        {
            name: 'Monto',
            selector: (row: IData) => row.monto,
            sortable: true,
        },
        {
            name: 'Referencia',
            selector: (row: IData) => row.referencia,
            sortable: true,
        },
        {
            name: 'Concepto',
            selector: (row: IData) => row.concepto,
            sortable: true,
        },
        {
            name: 'Fecha',
            selector: (row: IData) => row.fecha,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row: IData) => row.status,
            sortable: true,
        },
        {
            cell: (row: IData) => <IconButton onClick={() => check("aprobado", row.trx_id)} color="success"><ThumbUpRounded /></IconButton>,
            button: true,
            allowOverflow: true,
            ignoreRowClick: true
        },
        {
            cell: (row: IData) => <IconButton onClick={() => check("rechazado", row.trx_id)} color="error"><ThumbDownRounded /></IconButton>,
            button: true,
            allowOverflow: true,
            ignoreRowClick: true
        },
    ];
    const check = async (action: string, id: number) => {
        const url = `${baseUrl}/confirmapago`;
        const body = new FormData();

        body.append("trx_id", String(id));
        body.append("accion", action);

        const options = {
            method: "POST",
            body,
        }

        const respuesta = await fetch(url, options)
        const data = await respuesta.json();

        if (data.exito === "SI") {
            Swal.fire({
                title: "Exito",
                text: `Pago ${action}`,
                icon: "success",
            });
            getPagos()
        }
    }
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
    const getPagos = async () => {
        const url = `${baseUrl}/pagosporconfirmar`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setPagos(data.registros);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getPagos();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"}>Registro de Pagos</Typography>
                <Grid container spacing={1}>
                    {
                        Pagos && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={Pagos}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !Pagos && (
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