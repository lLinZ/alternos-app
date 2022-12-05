import { ChangeEvent, FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { AppBar, Box, Button, Dialog, DialogActions, Grid, MenuItem, Select, SelectChangeEvent, TextField, Toolbar, Typography, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';

import CloseIcon from '@mui/icons-material/CloseRounded';
import CircleIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CheckIcon from '@mui/icons-material/CheckCircleRounded';


interface Props {
    userLogged: User | null;
}
interface IPayment {
    tipo: string | null;
    monto: string | null;
    ref: string | null;
    fecha: string | null;
    concepto: string | null;
}
interface ISelectedClient {
    id: number;
    name: string;
    phone: string;
}
const MyActionBar = ({
    onAccept,
    onCancel,
    onClear,
    onSetToday,
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
export const WidgetPagoPorCliente: FC<Props> = ({ userLogged }) => {
    moment.locale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    }
    );
    const [payment, setPayment] = useState<IPayment>({
        tipo: null,
        monto: null,
        fecha: moment().format("YYYY-MM-DD"),
        ref: null,
        concepto: null
    })
    const [open, setOpen] = useState<boolean>(false);
    const [fecha, setFecha] = useState<Moment | null>(
        moment(),
    );

    const [clients, setClients] = useState<Client[] | null>(null);
    const [selectedClient, setSelectedClient] = useState<ISelectedClient | null>(null);
    const changeSelect = (e: SelectChangeEvent) => {
        setPayment({
            ...payment,
            tipo: e.target.value
        })
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

    const handleChangeFecha = (newValue: Moment | null) => {
        setFecha(newValue);
        setPayment({ ...payment, fecha: moment(newValue).format("YYYY-MM-DD") });
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "monto") {
            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
            setPayment({
                ...payment,
                [e.target.name]: onlyNums
            })
        } else {
            setPayment({
                ...payment,
                [e.target.name]: e.target.value
            })
        }
    }
    const onSubmit = async () => {
        let errores = [];
        console.log(payment)
        if (!payment.tipo || payment.tipo === "0") {
            errores.push("El tipo de pago es obligatorio");
        }
        if (!payment.monto || payment.monto === "0") {
            errores.push("El monto del pago es obligatorio");
        }
        if (!payment.fecha || payment.fecha === "0") {
            errores.push("La fecha de pago es obligatoria");
        }
        if (!selectedClient || selectedClient.id === 0) {
            errores.push("Debe seleccionar un cliente");
        }
        if (errores.length === 0) {

            try {

                const url = `${baseUrl}/reportepago`
                const body = new FormData();

                body.append("user_id", String(selectedClient?.id))
                body.append("monto", String(payment.monto))
                body.append("formapago", String(payment.tipo))
                body.append("referencia", String(payment.ref))
                body.append("fecha", payment.fecha ? String(payment.fecha) : moment().format("YYYY-MM-DD"))
                body.append("concepto", String(payment.concepto))
                const options = {
                    method: "POST",
                    body
                }
                const respuesta = await fetch(url, options)
                const data = await respuesta.json();
                if (data.exito === "SI") {
                    Swal.fire({
                        title: 'Exito',
                        text: "Pago notificado, espere a su aprobacion",
                        icon: "success"
                    })
                    setPayment({
                        tipo: null,
                        monto: null,
                        fecha: null,
                        ref: null,
                        concepto: null
                    })
                    setFecha(moment())
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se logro realizar el pago",
                        icon: "error"
                    })
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    title: "Error",
                    text: "No se logro conectar con el servidor",
                    icon: "error"
                })
            }
        } else {
            let errorString = '';
            errores.forEach((error: string) => errorString += `<p>- ${error}</p>`)
            Swal.fire({
                title: "Error",
                html: errorString,
                icon: "error"
            })
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        getClients();
    }, [])
    return (
        <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>
            <Box sx={{ m: 1, borderRadius: 5, p: 2, minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, background: "#FFF", minHeight: 250, maxHeight: 500, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)' }}>
                <Typography variant="overline" fontWeight={"bold"}>Reporte de pago por cliente</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Monto" value={payment.monto ? payment.monto : ''} name="monto" />
                    </Grid>
                    <Grid item xs={6}>
                        {/* <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Fecha" value={payment.fecha ? payment.fecha : ''} name="fecha" />
                     */}
                        <MobileDatePicker
                            label="Fecha"
                            inputFormat="DD/MM/YYYY"
                            value={fecha}
                            onChange={handleChangeFecha}
                            components={{
                                ActionBar: MyActionBar
                            }}
                            renderInput={(params: any) => <TextField color="secondary" {...params} fullWidth size="small" sx={styles.input} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Referencia" value={payment.ref ? payment.ref : ''} name="ref" />
                    </Grid>
                    <Grid item xs={6}>
                        <Select size="small" color='secondary' sx={{
                            fontSize: 12, "& fieldset": {
                                borderRadius: 3
                            }
                        }} fullWidth defaultValue={"0"} onChange={changeSelect} value={payment.tipo ? payment.tipo : '0'} name="tipo" >
                            <MenuItem value={"0"} disabled>Tipo de pago</MenuItem>
                            <MenuItem value={"bs-electronico"}>Bolivares electronicos</MenuItem>
                            <MenuItem value={"dolar-efectivo"}>Dolar efectivo</MenuItem>
                            <MenuItem value={"dolar-electronico"}>Dolar electronico</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth multiline label="Descripción" value={payment.concepto ? payment.concepto : ''} name="concepto" />
                    </Grid>
                    {
                        selectedClient && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
                                        <Typography variant="overline" fontWeight="bold">Cliente seleccionado</Typography>
                                        <Typography variant="subtitle2">{selectedClient.name}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">{selectedClient.phone}</Typography>
                                    </Box>
                                    <CheckIcon color="success" />
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" size="small" color={selectedClient ? "success" : 'info'} disableElevation onClick={() => setOpen(true)} sx={{ textTransform: "none", borderRadius: 3, p: 1 }}>Seleccionar Cliente</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" size="small" color="secondary" disableElevation onClick={() => onSubmit()} sx={{ textTransform: "none", borderRadius: 3, p: 1 }}>Registrar pago</Button>
                    </Grid>
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
    )
}
const styles = {
    input: {

        "& input": {
            fontSize: 12
        },
        "& label": {
            fontSize: 12,
        },
        "& fieldset": {
            borderRadius: 3,
        }
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