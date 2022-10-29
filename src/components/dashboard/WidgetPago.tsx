import { Box, Button, DialogActions, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react'
import Swal from 'sweetalert2';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
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

export const WidgetPago: FC<Props> = ({ userLogged }) => {
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
        fecha: null,
        ref: null,
        concepto: null
    })
    const [fecha, setFecha] = useState<Moment | null>(
        moment(new Date()),
    );
    const changeSelect = (e: SelectChangeEvent) => {
        setPayment({
            ...payment,
            tipo: e.target.value
        })
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

        if (!payment.tipo || payment.tipo === "0") {
            errores.push("El tipo de pago es obligatorio");
        }
        if (!payment.monto || payment.monto === "0") {
            errores.push("El monto del pago es obligatorio");
        }
        if (!payment.fecha || payment.fecha === "0") {
            errores.push("La fecha de pago es obligatoria");
        }
        if (errores.length === 0) {

            try {

                const url = `${baseUrl}/reportepago`
                const body = new FormData();

                body.append("user_id", String(userLogged?.id))
                body.append("monto", String(payment.monto))
                body.append("tipo", String(payment.tipo))
                body.append("referencia", String(payment.ref))
                body.append("fecha", String(payment.fecha))
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

    return (
        <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>
            <Box sx={{ borderRadius: 5, p: 2, minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, background: "#FFF", minHeight: 250, maxHeight: 250, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.3)' }}>
                <Typography variant="overline" fontWeight={"bold"}>Reporte de pago</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Monto" value={payment.monto} name="monto" />
                    </Grid>
                    <Grid item xs={6}>
                        {/* <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Fecha" value={payment.fecha} name="fecha" />
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
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Referencia" value={payment.ref} name="ref" />
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
                        <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth multiline label="Descripción" value={payment.concepto} name="concepto" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" size="small" color="secondary" disableElevation onClick={() => onSubmit()} sx={{ textTransform: "none", borderRadius: 3, p: 1 }}>Registrar pago</Button>
                    </Grid>
                </Grid>
            </Box>
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
