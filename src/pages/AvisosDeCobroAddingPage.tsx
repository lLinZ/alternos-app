import React, { Dispatch, FC, useEffect, useState } from 'react'
import { Box, Typography, Grid, TextField, IconButton, Select, MenuItem, Button, DialogActions, AppBar, Dialog, Toolbar } from '@mui/material'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { Formik, FormikValues, Form, FormikState } from 'formik'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Layout } from '../components/layout'
import { PageTitle } from '../components/ui'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'
import moment, { Moment } from 'moment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Client } from '../interfaces/client-type'
import { Offer } from './registros/RegistroOfferPage'
import { CheckCircle } from '@mui/icons-material'
import { FilterBox } from '../components/data/FilterBox'

const initialValues = {
    cuotas: 0,
    frecuencia: "0",
    monto: 0,
}

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


interface SelectedClient {
    id: number;
    name: string;
    phone: string;
}
interface SelectedOffer {
    id: number;
    salesman_name: string;
    customer_name: string;
    customer_id: string;
    precio_oferta: number;
    costo_oferta: number;
    montoavisosgenerados: number;
    saldoavisos: number;
}

export const AvisosDeCobroAddingPage = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null)
    const [openClient, setOpenClient] = useState<boolean>(false);
    const [openOffer, setOpenOffer] = useState<boolean>(false);

    const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
    const [selectedOffer, setSelectedOffer] = useState<SelectedOffer | null>(null)
    const router = useNavigate();
    const [inicio, setInicio] = useState<string>(moment().format("YYYY-MM-DD"))
    const [inicioFechaMoment, setInicioFechaMoment] = useState<Moment | null>(
        moment()
    );
    const handleChangeFecha = (newValue: Moment | null) => {
        setInicioFechaMoment(newValue);
        setInicio(moment(newValue).format("YYYY-MM-DD"));
    };

    moment.locale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    })
    /**
     * Funcion para enviar los datos del form a la API
     * @param values Valores del formulario
     */
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void) => {

        if (openClient) return false;
        if (openOffer) return false;

        if (!values) {
            return false;
        }
        const errores = [];

        if (!values.cuotas) errores.push("Las cuotas están vacías");
        if (!values.frecuencia) errores.push("La fecuencia está vacía");
        if (!values.monto) errores.push("El monto está vacío");
        if (!inicio) errores.push("Debe seleccionar una fecha de inicio");
        // if (!selectedClient) errores.push("Debe seleccionar un cliente");
        if (!selectedOffer) errores.push("Debe seleccionar una oferta");

        if (errores.length > 0) {
            let errorList: string = "";
            errores.forEach(error => errorList += `- ${error} <br />`);
            const alertaCamposVacios = await Swal.fire({
                title: "Error",
                html: errorList,
                icon: "error",
            });
            return false;
        }
        if (values.confirmPassword !== values.password) {
            const alertaError = await Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
            })
            return false;
        }
        const url = `${baseUrl}/avisosdecobro`;

        const body = new FormData();

        body.append("customer_id", String(selectedOffer?.customer_id));
        body.append("offer_id", String(selectedOffer?.id));
        body.append("cuotas", String(values.cuotas));
        body.append("frecuencia", String(values.frecuencia));
        body.append("monto", String(values.monto));
        body.append("inicio", String(inicio));
        const options = {
            method: "POST",
            body
        }
        try {

            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                const alertaExito = await Swal.fire({
                    title: "Exito",
                    text: data.mensaje,
                    icon: "success",
                })
                resetForm();
                router("/dashboard");
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "No se logro conectar con el servidor",
                icon: "error",
            })
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    return (
        <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>

            <Layout user={userLogged}>
                <Box sx={{ p: 1, width: "80%", margin: "auto" }}>
                    <PageTitle title="Registrar un aviso de cobro" />

                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values: FormikValues, { resetForm }) => onSubmit(values, resetForm)}
                        validateOnMount={false}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({ values, handleSubmit, handleChange, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <OfferSelection selectedOffer={selectedOffer} setSelectedOffer={setSelectedOffer} open={openOffer} setOpen={setOpenOffer} />
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.monto} variant="outlined" InputProps={{ sx: styles.input }} label="Monto" name="monto" type="text" color="secondary" />
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <TextField sx={{ "& fieldset": { border: "none" }, }} fullWidth onChange={handleChange} value={values.cuotas} variant="outlined" InputProps={{ sx: styles.input }} label="Cuotas" name="cuotas" type="text" color="secondary" />
                                    </Grid>
                                    <Grid item xs={12} lg={4}>
                                        <Select fullWidth color="secondary" sx={{ ...styles.input, "& fieldset": { border: "none" } }} defaultValue={"0"} value={values.frecuencia} onChange={handleChange} name="frecuencia" label="Frecuencia">
                                            <MenuItem value={"0"} disabled>Seleccionar una frecuencia</MenuItem>
                                            <MenuItem value={"unica"}>Única</MenuItem>
                                            <MenuItem value={"semanal"}>Semanal</MenuItem>
                                            <MenuItem value={"quincenal"}>Quincenal</MenuItem>
                                            <MenuItem value={"mensual"}>Mensual</MenuItem>
                                            <MenuItem value={"trimestral"}>Trimestral</MenuItem>
                                            <MenuItem value={"semestral"}>Semestral</MenuItem>
                                            <MenuItem value={"anual"}>Anual</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MobileDatePicker
                                            label="Hasta"
                                            inputFormat="DD-MM-YYYY"
                                            value={inicioFechaMoment}
                                            onChange={handleChangeFecha}
                                            OpenPickerButtonProps={{ color: "secondary" }}
                                            components={{
                                                ActionBar: MyActionBar
                                            }}
                                            minDate={moment()}
                                            renderInput={(params: any) => <TextField color="secondary" {...params} InputProps={{ sx: styles.input }} variant="outlined" fullWidth />}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <ClientSelection selectedClient={selectedClient} setSelectedClient={setSelectedClient} open={openClient} setOpen={setOpenClient} />
                                    </Grid> */}
                                    <Grid item xs={12}>
                                        <Button type="submit" fullWidth variant="contained" color="secondary" sx={styles.button} disableElevation>Registrar</Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Layout>
        </LocalizationProvider>

    )
}
const styles = {
    input: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5, background: "#FFF" },
    button: { boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", p: 2, borderRadius: 5, textTransform: "none" }
}
interface ClientSelectionProps {
    selectedClient: SelectedClient | null;
    setSelectedClient: Dispatch<any>;
    open: boolean;
    setOpen: Dispatch<any>;
}
const ClientSelection: FC<ClientSelectionProps> = ({ selectedClient, setSelectedClient, open, setOpen }) => {

    const [clients, setClients] = useState<Client[] | null>(null);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const getClients = async () => {
        const url = `${baseUrl}/listaclientes`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === 'SI') {
                setClients(data.registros)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getClients();
    }, [])

    const localStyles = {
        button: {
            borderRadius: 5,
            p: 1.9,
            textTransform: 'none',
            boxShadow: "0 0 5px rgba(100,100,100,0.1)"
        },
        mainContainer: {
            width: '80%',
            margin: '20px auto'
        },
        clientBox: {
            borderRadius: 5,
            background: "rgba(255,255,255,0.7)",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
            p: 3,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        selectedClientButton: {
            borderRadius: 5,
            p: 2,
            textTransform: "none",
            boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)"
        },
        selectedClientContainer: {
            marginBlock: 1,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FFF",
            borderRadius: 5,
            "&:hover": {
                boxShadow: "0 0 5px rgba(100,100,100,0.1)"
            }
        }
    }
    const selectClient = (client: Client) => {
        setSelectedClient({
            id: client.id,
            name: client.name,
            phone: client.phone,
        })
        handleClose();
    }
    return (
        <>
            <Button onClick={handleOpen} variant={'contained'} fullWidth disableElevation color={'primary'} sx={localStyles.selectedClientButton}>Seleccionar cliente</Button>

            {
                selectedClient && (
                    <Box sx={localStyles.selectedClientContainer}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={"bold"}>Cliente seleccionado</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{selectedClient?.name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{selectedClient?.phone}</Typography>
                        </Box>
                        <CheckCircle color="success" />
                    </Box>
                )
            }
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Cliente
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={localStyles.mainContainer}>
                    {clients && (<FilterBox data={clients} setData={setClients} category1={'name'} category2={'phone'} category3={'username'} />)}
                    {
                        clients && clients?.map((c) => (
                            <>
                                <Box sx={localStyles.clientBox} key={`${c.id}${c.name}`}>
                                    <Box>
                                        <Typography variant={'subtitle1'} fontWeight="bold">{c.name}</Typography>
                                        <Typography variant={'subtitle2'} color="text.secondary" fontWeight="bold">{c.username}</Typography>
                                        <Typography variant={'subtitle2'} color="text.secondary" fontWeight="bold">{c.phone}</Typography>
                                    </Box>
                                    <Button color="secondary" variant="contained" disableElevation sx={localStyles.selectedClientButton} onClick={() => selectClient(c)} disabled={c.id === selectedClient?.id}>{c.id === selectedClient?.id ? "Seleccionado" : "Seleccionar"}</Button>
                                </Box>
                            </>
                        ))
                    }
                </Box>
            </Dialog>
        </>
    )
}
interface OfferSelectionProps {
    selectedOffer: SelectedOffer | null;
    setSelectedOffer: Dispatch<any>;
    open: boolean;
    setOpen: Dispatch<any>;
}
const OfferSelection: FC<OfferSelectionProps> = ({ selectedOffer, setSelectedOffer, open, setOpen }) => {
    const [offers, setOffers] = useState<Offer[] | null>(null);

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const getOffers = async () => {

        const url = `${baseUrl}/listaofertas`
        try {
            const respuesta = await fetch(url);
            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        setOffers(data.registros)
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getOffers();
    }, [])
    const localStyles = {
        button: {
            borderRadius: 5,
            p: 1.9,
            textTransform: 'none',
            boxShadow: "0 0 5px rgba(100,100,100,0.1)"
        },
        mainContainer: {
            width: '80%',
            margin: '20px auto'
        },
        offerBox: {
            borderRadius: 5,
            background: "rgba(255,255,255,0.7)",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
            p: 3,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        selectOfferButton: {
            borderRadius: 5,
            p: 2,
            textTransform: "none",
            boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)"
        },
        selectedOfferContainer: {
            marginBlock: 1,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FFF",
            borderRadius: 5,
            "&:hover": {
                boxShadow: "0 0 5px rgba(100,100,100,0.1)"
            }
        }
    }
    const selectOffer = (offer: Offer) => {
        setSelectedOffer({
            id: offer.id,
            salesman_name: offer.salesman_name,
            customer_id: offer.customer_id,
            customer_name: offer.customer_name,
            precio_oferta: offer.precio_oferta,
            costo_oferta: offer.costo_oferta,
            montoavisosgenerados: offer.montoavisosgenerados,
            saldoavisos: offer.saldoavisos
        })
        handleClose();
    }
    return (
        <>
            <Button onClick={handleOpen} variant={'contained'} fullWidth disableElevation color={'primary'} sx={localStyles.selectOfferButton}>Seleccionar oferta</Button>

            {
                selectedOffer && (
                    <Box sx={localStyles.selectedOfferContainer}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={"bold"}>Oferta seleccionada #{selectedOffer?.id}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Comprador {selectedOffer?.customer_name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Vendedor {selectedOffer?.salesman_name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Precio {selectedOffer?.precio_oferta}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Costo {selectedOffer?.costo_oferta}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Total avisos de cobro generados {selectedOffer?.montoavisosgenerados}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Saldo por generar avisos de cobro {selectedOffer?.saldoavisos}</Typography>
                        </Box>
                        <CheckCircle color="success" />
                    </Box>
                )
            }
            <Dialog open={open} fullScreen onClose={handleClose} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar Oferta
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={localStyles.mainContainer}>
                    {offers && (<FilterBox data={offers} setData={setOffers} category1={'id'} category2={'precio_oferta'} category3={'customer_name'} category4={'salesman_name'} />)}
                    {
                        offers && offers?.map((o) => (
                            <>
                                <Box sx={localStyles.offerBox} key={`${o.id}${o.salesman_name}`}>
                                    <Box>
                                        <Typography variant={'subtitle1'} fontWeight="bold">Oferta #{o.id} - Cliente {o.customer_name}</Typography>
                                        <Typography variant={'subtitle1'}>Vendedor {o.salesman_name}</Typography>
                                        <Typography variant={'subtitle2'} color="text.secondary">Precio {o.precio_oferta}</Typography>
                                        <Typography variant={'subtitle2'} color="text.secondary">Costo {o.costo_oferta}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Total avisos de cobro generados {o.montoavisosgenerados}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Saldo por generar avisos de cobro {o.saldoavisos}</Typography>
                                    </Box>
                                    <Button color="secondary" variant="contained" disableElevation sx={localStyles.selectOfferButton} onClick={() => selectOffer(o)} disabled={o.id === selectedOffer?.id}>{o.id === selectedOffer?.id ? "Seleccionada" : "Seleccionar"}</Button>
                                </Box>
                            </>
                        ))
                    }
                </Box>
            </Dialog>
        </>
    )
}