import { Button, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, FC, useState } from 'react'
import Swal from 'sweetalert2';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type'

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
export const WidgetPago: FC<Props> = ({ userLogged }) => {
    const [payment, setPayment] = useState<IPayment>({
        tipo: null,
        monto: null,
        fecha: null,
        ref: null,
        concepto: null
    })
    const changeSelect = (e: SelectChangeEvent) => {
        setPayment({
            ...payment,
            tipo: e.target.value
        })
    }
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
        <Box sx={{ borderRadius: 5, p: 2, minWidth: 250, maxWidth: 250, background: "#FFF", minHeight: 250, maxHeight: 250 }}>
            <Typography variant="overline" fontWeight={"bold"}>Reporte de pago</Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Monto" value={payment.monto} name="monto" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Fecha" value={payment.fecha} name="fecha" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={styles.input} fullWidth label="Referencia" value={payment.ref} name="ref" />
                </Grid>
                <Grid item xs={12} md={6}>
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
