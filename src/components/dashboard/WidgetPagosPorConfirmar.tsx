import { FC, useEffect, useState } from 'react'
import { Box, Chip, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import { grey, yellow } from '@mui/material/colors';
import { Pago } from '../../interfaces/payment-type';

export const WidgetPagosPorConfirmar: FC = () => {
    const [pagos, setPagos] = useState<Pago[] | null>(null)
    const router = useNavigate();

    const getPagos = async () => {
        const url = `${baseUrl}/pagosporconfirmar`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setPagos(data.registros);
                console.log({ data })
            } else {
                console.log("Ocurrio un error al solicitar la informacion del estado de cuenta");
                console.log({ data })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!pagos) {
            getPagos();
        }
    });

    const styles = {
        mainContainer: {
            borderRadius: 5,
            m: 1,
            p: 2,
            minWidth: { xs: "100%", sm: 450 },
            maxWidth: { xs: "100%", sm: 450 },
            background: "#FFF",
            minHeight: 250,
            maxHeight: 300,
            overflowY: "scroll",
            flexFlow: "column wrap",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
            '&::-webkit-scrollbar': {
                width: '0.2em',
                height: "10px",
                borderRadius: "10px"
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: "none",
                webkitBoxShadow: "none"
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid rgba(255,255,255,0.2)',
                borderRadius: "10px",
                height: "10px"
            },
            cursor: "pointer",
        },
    }
    return (
        <Box sx={styles.mainContainer} onClick={() => router("/pagos")}>
            <Typography variant="overline" fontWeight="bold">Pagos por confirmar</Typography>

            <Box id="title" sx={{ pt: 2, pl: 2 }}>
            </Box>
            {
                pagos && pagos.map((p) => (
                    <PaymentCard key={p.trx_id} pago={p} />
                ))
            }{
                !pagos && (
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">No hay pagos abiertos</Typography>
                )
            }
        </Box>
    )
}
interface PaymentCardProps {
    pago: Pago;
}
export const PaymentCard: FC<PaymentCardProps> = ({ pago }) => {

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aprobado':
                return grey[900]
            case 'pendiente':
                return yellow[500];
            case 'rechazado':
                return red[500];
            default:
                return grey[500]
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: 'flex-start', justifyContent: "start" }}>
                <Chip sx={{ boxShadow: `0 0 8px ${getColorByStatus(pago.status)}`, color: "white", background: `${getColorByStatus(pago.status)}`, flex: 1 }} label={pago.status} />
                <Box sx={{ display: "flex", flexFlow: "column wrap", ml: 2, flex: 6 }}>

                    <Typography variant="subtitle1" fontWeight="bold">{pago.concepto}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">Ref: {pago.referencia}</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">${pago.monto}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">{String(pago.fecha)}</Typography>
                </Box>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}