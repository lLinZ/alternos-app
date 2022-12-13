import SendIcon from '@mui/icons-material/SendRounded';
import CancelIcon from '@mui/icons-material/CancelRounded';
import PayedIcon from '@mui/icons-material/MoneyRounded';
import NotEmitedIcon from '@mui/icons-material/ErrorRounded';
import { Divider, Chip, Box, Button, Typography } from '@mui/material';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../common/baseUrl';
import { FilterBox } from '../components/data/FilterBox';
import { Layout } from '../components/layout';
import { PageTitle } from '../components/ui';
import { AvisoDeCobro } from '../interfaces/avisodecobro-type';
import { User } from '../interfaces/user-type';
import { numberWithDots, ucfirst, validarToken } from '../lib/functions';
import { green, blue, red, orange } from '@mui/material/colors';
import Swal from 'sweetalert2';

export const AvisosDeCobroPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const router = useNavigate();
    const [avisos, setAvisos] = useState<AvisoDeCobro[] | null>(null)

    const getAvisos = async () => {
        const url = `${baseUrl}/listaavisosdecobro`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === 'SI') {
                setAvisos(data.registros)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged)
        getAvisos()
    }, [])

    const changeStatus = async (status: string, adviseId: number) => {
        const url = `${baseUrl}/cambiostatusavisosdecobro`;
        const body = new FormData();
        body.append("advise_id", String(adviseId));
        body.append("status", status);

        const options = {
            method: "POST",
            body
        }

        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();

            if (data.exito === 'SI') {
                Swal.fire({
                    title: "Exito",
                    text: "Se ha cambiado el status a " + status,
                    icon: "success",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                })
                getAvisos();
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se logro conectar al servidor",
                icon: "error",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            })
            console.log(error);
        }
    }
    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'no emitido':
                return orange[500];
            case 'pagado':
                return green[500]
            case 'emitido':
                return blue[500];
            default:
                return red[500]
        }
    }
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Avisos de cobro" navigate="/avisosdecobro/add" />
                {avisos && (<FilterBox data={avisos} setData={setAvisos} category1='name' category2='status' category3='phone' />)}
                {avisos && avisos.map((reg: any) => (
                    <Box key={reg.id} sx={styles.registroBox}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Chip variant="outlined" sx={{ color: getColorByStatus(reg.status), border: `1px solid ${getColorByStatus(reg.status)}` }} label={ucfirst(reg.status)} />
                            <Typography variant="subtitle2" color="text.secondary">Cuota {reg.cuota} de {reg.total_cuotas}</Typography>
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle1" fontWeight={'bold'}>Monto ${numberWithDots(reg.monto)},00</Typography>
                            <Typography variant="subtitle2">Comprador {reg.customer_name}</Typography>
                            <Typography variant="subtitle2">Vendedor {reg.salesman_name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Frecuencia {reg.frecuencia}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">Fecha a pagar {moment(reg.fecha).format("DD-MM-YYYY")}</Typography>
                        </Box>

                        <Divider textAlign="center" sx={{ fontSize: 12, fontWeight: "bold", color: "text.secondary" }}>Cambio de status</Divider>
                        <Box sx={styles.actions}>
                            <Button variant="outlined" size="small" sx={styles.button} color="secondary" endIcon={<SendIcon />} onClick={() => changeStatus('emitido', Number(reg.id))}>Emitido</Button>
                            <Button variant="outlined" size="small" sx={styles.button} color="secondary" endIcon={<NotEmitedIcon />} onClick={() => changeStatus('no emitido', Number(reg.id))}>No Emitido</Button>
                            <Button variant="outlined" size="small" sx={styles.button} color="secondary" endIcon={<PayedIcon />} onClick={() => changeStatus('pagado', Number(reg.id))}>Pagado</Button>
                            <Button variant="outlined" size="small" sx={styles.button} color="secondary" endIcon={<CancelIcon />} onClick={() => changeStatus('anulado', Number(reg.id))}>Anulado</Button>
                        </Box>
                    </Box>
                ))
                }
            </Box>
        </Layout>
    )
}

const styles = {
    mainContainer: {
        minHeight: '100vh',
        width: '80%',
        margin: '20px auto'
    },
    registroBox: {
        borderRadius: 3,
        background: "#FFF",
        p: 2,
        mb: 2,
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
        display: "flex",
        flexFlow: "column wrap",
        "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.2)" }
    },
    actions: {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "end"
    },
    button: {
        textTransform: "none",
        borderRadius: 10,
        marginBlock: 1,
        marginRight: 1,
    }
}