import React, { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Grid, MenuItem, Select, Typography, SelectChangeEvent, IconButton } from '@mui/material'

import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../common/baseUrl';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/SendRounded'
import { PageTitle } from '../components/ui';
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';

interface IData {
    client_id: number;
    client_name: string;
    item_id: number;
    name: string;
    categoria: string;
    etiquetas: string;
    url: string;
}

const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const BrandCenterPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [analisis, setAnalisis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [empty, setEmpty] = useState<boolean>(false)
    const [clientes, setClientes] = useState<any>(null);
    const [cliente, setCliente] = useState<any>(0);

    const [isDeleted, setIsDeleted] = useState<any>(false);

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
    const getAnalisis = async (clientId: string | number) => {
        setIsLoading(true);
        setEmpty(false);
        console.log(clientId)
        const url = `${baseUrl}/brandcenter?user_id=${clientId}`
        const options = {
            method: "GET",
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data.registros[0].items);
            if (data.exito === "SI") {
                setAnalisis(data.registros[0].items);
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
    const getClientes = async () => {
        const url = `${baseUrl}/clientesbrandcenter`
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (data.exito === "SI") {
            setClientes(data.registros)
        }
    }
    const handleChange = (e: SelectChangeEvent) => {
        setCliente(e.target.value);
    }

    const columns = [
      {
         name: 'Categoria',
         selector: (row: IData) => String(row.categoria),
         sortable: true,
     },
     {
            name: 'Descripción',
            selector: (row: IData) => String(row.name),
            sortable: true,
        },
        {
            name: 'etiquetas',
            selector: (row: IData) => String(row.etiquetas),
            sortable: true,
        },
        {
            cell: (row: IData) => <IconButton component="a" href={row.url} target="_blank" color="success"><AttachFileIcon /></IconButton>,
            button: true,
            sortable: false,
            name: "Ver pieza",
            allowOverflow: true,
            ignoreRowClick: true
        },
        {
            cell: (row: IData) => <IconButton onClick={() => eliminar(row.item_id)}><DeleteIcon color="error" /></IconButton>,
            button: true,
            name: "Enviar pieza",
            sortable: false,
        }
    ];

    const eliminar = async (id: number) => {
      const click = await Swal.fire({
         title: "¿Seguro?",
         text: "¿Deseas eliminar el registro?",
         icon: "warning",
         showCancelButton: true,
      })
      if (click.isConfirmed) {
         const url = `${baseUrl}/deletebrandcenter`;
         const body = new FormData();
         body.append("id", String(id));

         const options = {
            method: "POST",
            body
         }
         try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                Swal.fire({
                    title: "Exito",
                    toast: true,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    icon: "success",
                    position: "bottom-start"
                });
                setIsDeleted(true);
                getAnalisis(cliente);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró eliminar",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    icon: "error",
                });
            }
         } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: "error",
            });
         }
      }
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getClientes();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Información del brandcenter por cliente" />
                <Grid container spacing={1}>
                    {
                        clientes && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>

                                    <Select color="secondary" defaultValue={"0"} value={cliente !== 0 ? cliente : "0"} onChange={handleChange} style={{width: "500px"}} sx={{ "& fieldset": { borderRadius: 0 } }}>
                                        <MenuItem disabled value={"0"} style={{ width:"500px" }}>Seleccione un cliente</MenuItem>
                                        {
                                            clientes.map((u: any) => <MenuItem key={u.client_id + u.client_name} value={String(u.client_id)}  style={{ width:"500px" }}>{`#${u.client_id} - ${u.client_name.substr(0,50)}`}</MenuItem>)
                                        }
                                    </Select>
                                    <Button sx={{ borderRadius: 0, p: 2, }} disableElevation color="secondary" variant="contained" onClick={() => getAnalisis(cliente)}>Buscar</Button>
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
                                <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">Seleccione un cliente y clickee en &quot;Buscar&quot;</Typography>
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
                                    <Typography variant="subtitle2" color="error" fontWeight={"bold"}>Este cliente no tiene información en brandcenter...</Typography>
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