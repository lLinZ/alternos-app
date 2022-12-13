import { FC, useEffect, useState } from 'react'
import { Box, Chip, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import green from '@mui/material/colors/green';
import grey from '@mui/material/colors/grey';
import orange from '@mui/material/colors/orange';
import { ucfirst } from '../../lib/functions';
import { AvisoDeCobro } from '../../interfaces/avisodecobro-type';
import moment from 'moment';

export const WidgetAvisosDeCobro: FC = () => {
    const [avisos, setAvisos] = useState<AvisoDeCobro[] | null>(null)
    const router = useNavigate();

    const getAvisos = async () => {
        const url = `${baseUrl}/listaavisosdecobro?status=no emitido`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setAvisos(data.registros);
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
        if (!avisos) {
            getAvisos();
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
            maxHeight: 250,
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
        <Box sx={styles.mainContainer} onClick={() => router("/avisosdecobro")}>
            <Typography variant="overline" fontWeight="bold">Avisos de cobro</Typography>

            <Box id="title" sx={{ pt: 2, pl: 2 }}>
            </Box>
            {
                avisos && avisos.map((a) => (
                    <AvisoCard key={a.id} aviso={a} />
                ))
            }{
                !avisos && (
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">No hay avisos de cobro nuevos</Typography>
                )
            }
        </Box>
    )
}
interface AvisoCardProps {
    aviso: AvisoDeCobro;
}
export const AvisoCard: FC<AvisoCardProps> = ({ aviso }) => {

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'emitido':
                return green[500]
            case 'no emitido':
                return orange[500];
            default:
                return grey[500]
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: 'flex-start', justifyContent: "start" }}>
                <Chip size="small" sx={{ boxShadow: `0 0 8px ${getColorByStatus(aviso.status)}`, color: "white", background: `${getColorByStatus(aviso.status)}`, flex: 2 }} label={ucfirst(aviso.status)} />
                <Box sx={{ display: "flex", flexFlow: "column wrap", ml: 2, flex: 6 }}>

                    <Typography variant="subtitle1" fontWeight="bold">${aviso.monto}</Typography>
                    <Typography variant="subtitle2">Cuota {aviso.cuota} de {aviso.total_cuotas}</Typography>
                    <Typography variant="subtitle2" color="text.secondary"> {aviso.frecuencia}</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">Comprador {aviso.customer_name}</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">Vendedor {aviso.salesman_name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">{moment(aviso.fecha).format('DD-MM-YYYY')}</Typography>
                </Box>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}