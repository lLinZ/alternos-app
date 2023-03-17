import { FC, useEffect, useState } from 'react'

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
        name: 'Requerimiento',
        selector: (row: IData) => '(#' + row.line_id + ') ' + row.description,
        sortable: true,
        width: "14rem"
    },
    {
        name: 'Tarea',
        selector: (row: IData) => row.activity_name,
        sortable: true,
        width: "15rem"
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
];
interface IData {
    line_id: string;
    description: string;
    activity_name: string;
    inicio: string | number;
    vence: string | number;
    status: string | number;
    inicio_real: string | number;
    fin_real: string | number;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

export const RegistroTareasPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [Tareas, setTareas] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<User[] | null>(null);
    const [user, setUser] = useState<any>(0);
    const [userSelected, setUserSelected] = useState<User | null>(null);
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
    const getTareas = async (userId: string | number) => {
        setIsLoading(true);
        const url = `${baseUrl}/tareasporusuario`
        const body = new FormData();

        body.append("user_id", String(userId))
        const options = {
            method: "POST",
            body
        }
        const respuesta = await fetch(url, options);
        const data = await respuesta.json();
        console.log(data);
        if (data.exito === "SI") {
            setTareas(data.registros[0].activities);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }
    const getUsers = async () => {
        const url = `${baseUrl}/listaregistros?role_id=3`
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (data.exito === "SI") {
            setUsers(data.registros)
        }
    }
    const handleChange = (e: SelectChangeEvent) => {
        setUser(e.target.value);
        if (users) {
            const selected = users?.filter((u: User) => Number(u.id) === Number(e.target.value))[0];
            setUserSelected(selected ? selected : null);
        } else {
            setUserSelected(null);
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getUsers();
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Tareas por usuario" />
                <Grid container spacing={1}>
                    {
                        users && (
                            <Grid item xs={12} display="flex" flexDirection="row" flexWrap={"wrap"} >
                                <Box sx={{ display: "flex", flexFlow: "row nowrap", alignItems: "center" }}>

                                    <Select color="secondary" defaultValue={"0"} size="small" value={user !== 0 ? user : "0"} onChange={handleChange} sx={{ "& fieldset": { borderRadius: 0 } }}>
                                        <MenuItem disabled value={"0"}>Seleccione un usuario</MenuItem>
                                        {
                                            users.map((u: any) => <MenuItem key={`${u.id} ${u.name} ${u.function_name}`} value={String(u.id)}>{u.name}</MenuItem>)
                                        }
                                    </Select>
                                    <Button sx={{ borderRadius: 0, p: 1, textTransform: "none" }} size="small" disableElevation color="secondary" variant="contained" onClick={() => getTareas(user)}>Buscar</Button>
                                </Box>
                                {
                                    userSelected && (
                                        <Box sx={{ display: "flex", flexFlow: "column wrap", m: 1 }}>

                                            <Typography variant="subtitle2" fontWeight="bold">Departamento</Typography>
                                            <Typography variant="subtitle2" color="text.secondary" >{userSelected.function_name}</Typography>
                                        </Box>
                                    )
                                }
                            </Grid>
                        )
                    }
                    {
                        Tareas && (
                            <Grid item xs={12}>
                                <DataTable
                                    columns={columns}
                                    data={Tareas}
                                    customStyles={customStyles}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                />
                            </Grid>
                        )
                    }
                    {
                        !Tareas && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">Seleccione un usuario y clickee en &quot;Buscar&quot;</Typography>
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