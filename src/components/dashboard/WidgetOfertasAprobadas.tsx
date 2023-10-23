import React, { FC, useEffect, useState } from 'react'
import { Box, Chip, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { green } from '@mui/material/colors';
import moment from 'moment';
import { Offer } from '../../pages/registros/RegistroOfferPage';
import { ucfirst } from '../../lib/functions';

export const WidgetOfertasAprobadas: FC = () => {
    const [ofertas, setOfertas] = useState<Offer[] | null>(null)
    const router = useNavigate();

    const getOfertas = async () => {
        const url = `${baseUrl}/listaofertas?status=nueva`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setOfertas(data.registros);
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
        if (!ofertas) {
            getOfertas();
        }
    });

    const styles = {
        mainContainer: {
            minWidth: { xs: "100%", sm: 450 },
            maxWidth: {
                xs: "100%",
                sm: 450
            },
            m: 1,
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
            background: "#fff",
            borderRadius: 5,
            overflow: "hidden",
            cursor: "pointer",
            transition: ".3s ease all",
            "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" },
            minHeight: 300,
            maxHeight: 300
        },
        content: {
            p: 2,
            minHeight: "300px",
            maxHeight: "300px",
            overflowY: "scroll",
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
            }
        }
    }
    return (
        <Box sx={styles.mainContainer} onClick={() => router("/offer/resume")}>

            <Box id="title" sx={{
                pt: 2,
                pl: 2
            }}>
                <Typography variant="overline" fontWeight="bold">Ofertas por confirmar</Typography>
            </Box>
            <Box id="content" sx={styles.content}>
                {
                    ofertas && ofertas.map((o) => (
                        <OfferCard key={o.id} offer={o} />
                    ))
                }{
                    !ofertas && (
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">No hay ofertas por confirmar</Typography>
                    )
                }
            </Box>
        </Box>
    )
}
interface OfferCardProps {
    offer: Offer;
}
export const OfferCard: FC<OfferCardProps> = ({ offer }) => {


    return (
        <>
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: 'flex-start', justifyContent: "start" }}>
                <Chip sx={{ boxShadow: `0 0 8px ${green[500]}`, color: "white", background: `${green[500]}`, flex: 1 }} label={ucfirst(offer.status)} />
                <Box sx={{ display: "flex", flexFlow: "column wrap", ml: 2, flex: 6 }}>

                    <Typography variant="subtitle1" fontWeight={'bold'} >Comprador {offer.customer_name}</Typography>
                    <Typography variant="subtitle1" fontWeight={'bold'} >Vendedor {offer.salesman_name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Precio ${offer.precio_oferta}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Costo ${offer.costo_oferta}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">{moment(offer.fecha).format('DD-MM-YYYY')}</Typography>
                </Box>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}