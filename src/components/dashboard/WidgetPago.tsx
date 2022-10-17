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
    fecha: string | null;
    descripcion: string | null;
}
export const WidgetPago: FC<Props> = ({ userLogged }) => {
    const [payment, setPayment] = useState<IPayment>({
        tipo: null,
        monto: null,
        fecha: null,
        descripcion: null
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

                body.append("monto", String(payment.monto))
                body.append("tipo", String(payment.tipo))
                body.append("fecha", String(payment.fecha))
                body.append("descripcion", String(payment.descripcion))
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
        <Box sx={{ borderRadius: 5, p: 2, minWidth: 400, background: "#FFF" }}>
            <Typography variant="overline" fontWeight={"bold"}>Reporte de pago</Typography>
            <Grid container spacing={1}>

                <Grid item xs={12} md={6}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={{
                        "& fieldset": {
                            borderRadius: 3
                        }
                    }} fullWidth label="Monto" name="monto" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={{
                        "& fieldset": {
                            borderRadius: 3
                        }
                    }} fullWidth label="Fecha" name="fecha" />
                </Grid>
                <Grid item xs={12}>
                    <Select size="small" color='secondary' sx={{
                        "& fieldset": {
                            borderRadius: 3
                        }
                    }} fullWidth defaultValue={"0"} onChange={changeSelect} value={payment.tipo ? payment.tipo : '0'} name="tipo" >
                        <MenuItem value={"0"} disabled>Tipo de pago</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={handleChange} size="small" color='secondary' sx={{
                        "& fieldset": {
                            borderRadius: 3
                        }
                    }} fullWidth multiline label="Descripción" name="descripcion" />
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" size="small" color="secondary" onClick={() => onSubmit()} sx={{ textTransform: "none", borderRadius: 3, p: 1 }}>Registrar pago</Button>
                </Grid>
            </Grid>
        </Box>
    )
}
