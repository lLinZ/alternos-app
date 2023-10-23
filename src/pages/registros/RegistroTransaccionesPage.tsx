import React, { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, Grid, TextField, Typography, DialogActions } from '@mui/material'

import { Layout } from '../../components/layout'
import { User } from '../../interfaces/user-type'
import { validarToken } from '../../lib/functions'
import DataTable from 'react-data-table-component';
import { baseUrl } from '../../common/baseUrl';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { PageTitle } from '../../components/ui';
const columns = [
    {
        name: 'Usuario',
        selector: (row: IData) => row.user_name,
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
        name: 'Forma de pago',
        selector: (row: IData) => row.formapago,
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
];
interface IData {
    user_name: string;
    monto: string | number;
    referencia: string;
    formapago: string;
    concepto: string;
    fecha: string;
    status: string;
}
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};
const MyActionBar = ({
    onAccept,
    onCancel,
}: PickersActionBarProps) => {

    return (
        <DialogActions>
            <Button sx={{ textTransform: "none" }} onClick={onCancel} color="error"> Cancelar </Button>
            <Button sx={{ textTransform: "none" }} onClick={onAccept} color="secondary"> Seleccionar </Button>
        </DialogActions>
    );
};
export const RegistroTransaccionesPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const router = useNavigate();
    const [Transacciones, setTransacciones] = useState<IData[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [from, setFrom] = useState<string>('')
    const [to, setTo] = useState<string>('')
    const [fechaFrom, setFechaFrom] = useState<Moment | null>(
        moment(new Date()),
    );
    const [fechaTo, setFechaTo] = useState<Moment | null>(
        moment(new Date()),
    );
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
    const handleChangeFechaFrom = (newValue: Moment | null) => {
        setFechaFrom(newValue);
        setFrom(moment(newValue).format("YYYY-MM-DD"));
    };
    const handleChangeFechaTo = (newValue: Moment | null) => {
        setFechaTo(newValue);
        setTo(moment(newValue).format("YYYY-MM-DD"));
    };
    const getTransacciones = async (from = null as string | null, to = null as string | null) => {
        setIsLoading(true);
        let url = '';
        url = from && to ? `${baseUrl}/transaccionesporfecha?desde=${from}&hasta=${to}` : url !== '' ? url : '';
        url = !from && to ? `${baseUrl}/transaccionesporfecha?hasta=${to}` : url !== '' ? url : '';
        url = from && !to ? `${baseUrl}/transaccionesporfecha?desde=${from}` : url !== '' ? url : '';
        url = !from && !to ? `${baseUrl}/transaccionesporfecha` : url !== '' ? url : '';

        const respuesta = await fetch(url);

        const data = await respuesta.json();
        if (data.exito === "SI") {
            setTransacciones(data.registros);
            setIsLoading(false);
            console.log(data.registros)
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getTransacciones()
    }, [])
    moment.locale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    }
    );
    return (
        <Layout user={userLogged}>
            <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>

                <Box sx={styles.mainContainer}>
                    <PageTitle title="Lista de Transacciones" />
                    <Grid container spacing={1}>
                        <Box sx={styles.searchContainer}>
                            <Typography variant="overline">Buscar registros por fecha</Typography>
                            <Box sx={styles.fromToContainer}>
                                <MobileDatePicker
                                    label="Desde"
                                    inputFormat="DD-MM-YYYY"
                                    value={fechaFrom}
                                    onChange={handleChangeFechaFrom}
                                    OpenPickerButtonProps={{ color: "secondary" }}
                                    components={{
                                        ActionBar: MyActionBar
                                    }}
                                    renderInput={(params: any) => <TextField color="secondary" {...params} fullWidth InputProps={{ sx: { ...styles.inputSearch, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }} />}
                                />
                                <Divider orientation='vertical' />
                                <MobileDatePicker
                                    label="Hasta"
                                    inputFormat="DD-MM-YYYY"
                                    value={fechaTo}
                                    onChange={handleChangeFechaTo}
                                    OpenPickerButtonProps={{ color: "secondary" }}
                                    components={{
                                        ActionBar: MyActionBar
                                    }}
                                    renderInput={(params: any) => <TextField color="secondary" {...params} fullWidth InputProps={{ sx: { ...styles.inputSearch, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } }} />}
                                />
                            </Box>
                            <Button variant="contained" color="secondary" sx={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} disableElevation onClick={() => getTransacciones(from !== '' ? from : null, to !== '' ? to : null)}>Buscar</Button>
                        </Box>
                        {
                            Transacciones && Transacciones.length > 0 && (
                                <Grid item xs={12}>
                                    <DataTable
                                        columns={columns}
                                        data={Transacciones}
                                        customStyles={customStyles}
                                        pagination
                                        paginationComponentOptions={paginationComponentOptions}
                                    />
                                </Grid>
                            )
                        }

                        {
                            (!Transacciones || Transacciones.length < 1) && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                        <Typography variant="subtitle2" color="error" >No se encontraron registros</Typography>
                                    </Box>
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
            </LocalizationProvider>
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