import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import { Box, Button, CircularProgress, Divider, Grid, TextField, Typography, DialogActions, AppBar, Dialog, IconButton, Toolbar } from '@mui/material'

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

import CloseIcon from '@mui/icons-material/CloseRounded';
import CircleIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CheckIcon from '@mui/icons-material/CheckCircleRounded';
import Swal from 'sweetalert2';
import { PageTitle } from '../../components/ui';


const columns = [

    {
        name: 'Referencia',
        selector: (row: IAccountTransactions) => row.ref_id,
        sortable: true,
    },
    {
        name: 'Tipo de Documento',
        selector: (row: IAccountTransactions) => row.type_doc.substring(0, 1).toUpperCase() + row.type_doc.substring(1).toLocaleLowerCase(),
        sortable: true,
    },
    {
        name: 'Tipo de transaccion',
        selector: (row: IAccountTransactions) => row.trx_type,
        sortable: true,
    },
    {
        name: 'Nombre de transaccion',
        selector: (row: IAccountTransactions) => row.trx_name,
        sortable: true,
    },
    {
        name: 'Inicial',
        selector: (row: IAccountTransactions) => row.initial,
        sortable: true,
    },
    {
        name: 'Débito',
        selector: (row: IAccountTransactions) => row.debits,
        sortable: true,
    },
    {
        name: 'Crédito',
        selector: (row: IAccountTransactions) => row.credits,
        sortable: true,
    },
    {
        name: 'Balance',
        selector: (row: IAccountTransactions) => row.balance,
        sortable: true,
    },
    {
        name: 'Fecha',
        selector: (row: IAccountTransactions) => moment(row.date).format("DD-MM-YYYY"),
        sortable: true,
    },
];
export interface IAccountTransactions {
    id: number;
    date: Date;
    type_doc: string;
    doc_id: string;
    ref_id: string;
    trx_type: string;
    trx_name: string;
    mark: string;
    initial: number;
    debits: number;
    credits: number;
    balance: number;
}


// Data de la paginacion de la tabla
const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
};

// Action bar del calendario
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
interface Client {
    id: number;
    name: string;
    phone: string;
    username: string;
    password: string;
    role_id: number;
    role_name: string;
    function_id: number;
    function_name: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
interface ISelectedClient {
    id: number;
    name: string;
    phone: string;
}
export const RegistroAccountAdminPage: FC = () => {

    // Usuario conectado
    const [userLogged, setUserLogged] = useState<User | null>(null)

    // Transacciones
    const [AccountTransactions, setAccountTransactions] = useState<IAccountTransactions[] | null>(null);

    // Loader
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // State desde
    const [from, setFrom] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));

    // State hasta
    const [to, setTo] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));

    // Fecha desde
    const [fechaFrom, setFechaFrom] = useState<Moment | null>(
        moment(new Date()),
    );

    // Fecha Hasta
    const [fechaTo, setFechaTo] = useState<Moment | null>(
        moment(new Date()),
    );

    const [clients, setClients] = useState<Client[] | null>(null)
    const [selectedClient, setSelectedClient] = useState<ISelectedClient | null>(null);

    const [open, setOpen] = useState<boolean>(false);
    // Router
    const router = useNavigate();
    const customStyles = {
        rows: {
            style: {
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e5e5e5',
                },
            },
        },
    }

    const getClients = async () => {
        const url = `${baseUrl}/listaclientes`
        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                setClients(data.registros);
            } else {
                console.error('No se encontraron clientes', data.mensaje);
            }

        } catch (error) {
            console.error('No se encontraron clientes', error);

        }
    }

    /**
     * Funcion para cambiar la fecha desde
     * @param newValue Nueva fecha
     */
    const handleChangeFechaFrom = (newValue: Moment | null) => {
        setFechaFrom(newValue);
        setFrom(moment(newValue).format("YYYY-MM-DD"));
    };

    /**
     * Funcion para cambiar la fecha hasta
     * @param newValue Nueva fecha
     */
    const handleChangeFechaTo = (newValue: Moment | null) => {
        setFechaTo(newValue);
        setTo(moment(newValue).format("YYYY-MM-DD"));
    };

    /**
     * Funcion para obtener estado de cuenta
     * @param from desde
     * @param to hasta
     * @returns false si no se ha iniciado sesion
     */
    const getAccountState = async (from = null as string | null, to = null as string | null) => {
        setIsLoading(true);

        if (!selectedClient) {
            Swal.fire({
                text: "Seleccione un cliente",
                icon: "error",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            })
            setIsLoading(false);
            return false;
        }

        let url = '';
        url = from && to ? `${baseUrl}/edoctaperiodo?user_id=${selectedClient?.id}&desde=${from}&hasta=${to}` : url !== '' ? url : '';
        url = !from && to ? `${baseUrl}/edoctaperiodo?user_id=${selectedClient?.id}&hasta=${to}` : url !== '' ? url : '';
        url = from && !to ? `${baseUrl}/edoctaperiodo?user_id=${selectedClient?.id}&desde=${from}` : url !== '' ? url : '';
        url = !from && !to ? `${baseUrl}/edoctaperiodo?user_id=${selectedClient?.id}` : url !== '' ? url : '';
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setAccountTransactions(data.registros[0].transactions);
                setIsLoading(false);
                console.log(data.registros[0].transactions)
            } else {
                setAccountTransactions(null);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    // Effect
    useEffect(() => {
        validarToken(router, setUserLogged);
        getClients();
    }, [])

    // Configuración del calendario
    moment.locale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    }
    );
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <Layout user={userLogged}>
            <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>

                <Box sx={styles.mainContainer}>
                    <PageTitle title="Estado de cuenta por cliente" />
                    {
                        selectedClient && (
                            <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
                                    <Typography variant="overline" fontWeight="bold">Cliente seleccionado</Typography>
                                    <Typography variant="subtitle2">{selectedClient.name}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">{selectedClient.phone}</Typography>
                                </Box>
                                <CheckIcon color="success" />
                            </Box>
                        )
                    }
                    <Button fullWidth sx={{ borderRadius: 3, p: 1.8, textTransform: "none", marginBlock: 2 }} onClick={() => setOpen(true)} color={selectedClient ? "success" : 'warning'} disableElevation variant="contained">{selectedClient ? 'Cambiar cliente' : 'Seleccionar Cliente'}</Button>
                    <Grid container spacing={1}>
                        <Box sx={styles.searchContainer}>
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
                            <Button variant="contained" color="secondary" sx={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} disableElevation onClick={() => getAccountState(from !== '' ? from : null, to !== '' ? to : null)}>Buscar</Button>
                        </Box>
                        {
                            AccountTransactions && AccountTransactions.length > 0 && (
                                <Grid item xs={12}>
                                    <DataTable
                                        columns={columns}
                                        data={AccountTransactions}
                                        customStyles={customStyles}
                                        pagination
                                        paginationComponentOptions={paginationComponentOptions}
                                    />
                                </Grid>
                            )
                        }

                        {
                            (!AccountTransactions || AccountTransactions.length < 1) && (
                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", flexFlow: "row wrap", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                        <Typography variant="subtitle2" color="text.secondary" >No se encontraron registros</Typography>
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
                <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { background: "#f1f1f1" } }} fullScreen>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6">Seleccionar Cliente</Typography>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ width: "80%", margin: "20px auto", }}>
                        {clients && clients.map((c) => (
                            <ClientCard key={c.id} client={c} selectedClient={selectedClient} setSelectedClient={setSelectedClient} setOpen={setOpen} />
                        ))}
                    </Box>
                </Dialog>
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
        mt: 2
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


interface ClientCardProps {
    client: Client;
    selectedClient: ISelectedClient | null;
    setSelectedClient: Dispatch<SetStateAction<ISelectedClient | null>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
const ClientCard: FC<ClientCardProps> = ({ client, selectedClient, setSelectedClient, setOpen }) => {

    const select = () => {
        setSelectedClient({ id: client.id, name: client.name, phone: String(client.phone) });
        setOpen(false);
    }

    return (
        <Box sx={{ width: "100%", p: 2, borderRadius: 5, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", display: "flex", flexFlow: "row wrap", justifyContent: "space-between", alignItems: "center", background: "#FFF", mt: 2 }} >
            <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
                <Typography variant="subtitle1">{client.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">{client.username}</Typography>
                <Typography variant="subtitle2" color="text.secondary">{client.phone}</Typography>
            </Box>
            <IconButton disabled={selectedClient && selectedClient.id === client.id ? true : false} onClick={select}>
                {selectedClient && selectedClient.id === client.id ? (<CheckIcon color="success" />) : (<CircleIcon />)}
            </IconButton>
        </Box>
    )
}