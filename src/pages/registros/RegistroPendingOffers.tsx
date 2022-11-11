import { FC, useEffect, useState } from 'react';

import { Layout } from '../../components/layout';
import { User } from '../../interfaces/user-type';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { getFormatDistanceToNow, numberWithDots, ucfirst, validarToken } from '../../lib/functions';
import Typography from '@mui/material/Typography';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import { Button, Collapse, Divider, IconButton, IconButtonProps, styled } from '@mui/material';
import SendRounded from '@mui/icons-material/SendRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { blue, green, red } from '@mui/material/colors';


interface Offer {
    id: number;
    customer_id: number;
    customer_name: string;
    salesman_id: number;
    salesman_name: string;
    fecha: string;
    created_at: string;
    costo_oferta: number;
    precio_oferta: number;
    status: string;
    items: Item[] | [];
}

interface Item {
    item_id: number;
    product_id: number;
    description: string;
    type: string;
    costo: number;
    precio: number;
    status: string;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton sx={{ "&:hover": { background: "none" } }} {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    // transition: theme.transitions.create('transform', {
    //     duration: theme.transitions.duration.shortest,
    // }),
}));

export const RegistroPendingOffersPage: FC = () => {

    const [offers, setOffers] = useState<Offer[] | null>(null);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const router = useNavigate()

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "enviada":
                return "success";
            case "confirmada":
                return "info";
            case "rechazada":
                return "error";
            default:
                return "secondary"
        }
    }
    const getHexColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "enviada":
                return green[500];
            case "confirmada":
                return blue[500];
            case "rechazada":
                return red[500];
            default:
                return "#000"
        }
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
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: data.mensaje,
                            icon: "error",
                        });
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
    const send = async (id: number, accion: "soloconfirmar" | "confirmaryenviar") => {
        const url = `${baseUrl}/confirmaoferta`;

        const body = new FormData();
        body.append("id", String(id));
        body.append("accion", accion);
        console.log(id, accion)
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options)
            switch (respuesta.status) {
                case 200:
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        Swal.fire({
                            title: "Exito",
                            text: `Se ha ${accion === "soloconfirmar" ? "confirmado" : "confirmado y enviado"} la oferta`,
                            icon: "success"
                        })
                        console.log(data);
                        getOffers();
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: data.mensaje,
                            icon: "error"
                        })
                        console.log(data)
                    }
                    break;
                default:
                    Swal.fire({
                        title: "Error",
                        text: `No se logró ${accion === "soloconfirmar" ? "confirmar" : "confirmar y enviar"} la oferta`,
                        icon: "error",
                    })
                    break;
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error"
            })
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
        getOffers();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight="bold">Resumen de ofertas</Typography>
                <Box sx={styles.offersContainer}>
                    {
                        offers && offers.map((offer) => (
                            <Box key={offer.id} sx={styles.offerItem}>

                                <Chip size="small" color={getColorByStatus(offer.status)} label={ucfirst(offer.status.toLowerCase())} sx={{ ...styles.chip, boxShadow: `0 0 10px ${getHexColorByStatus(offer.status)}` }} />
                                <Typography variant="subtitle1">Cliente {offer.customer_name}</Typography>
                                <Typography variant="subtitle1">Vendedor {offer.salesman_name}</Typography>
                                <Typography variant="subtitle2" fontWeight={300} color="text.secondary">{getFormatDistanceToNow(new Date(offer.created_at))}</Typography>

                                <CollapsibleData offer={offer} />
                                <Box sx={styles.offerActions}>
                                    {/* Boton confirmar */}
                                    {offer.status !== "enviada" && offer.status !== "confirmada" && (
                                        <Button variant="outlined" size="small" color="secondary" sx={styles.button} onClick={() => send(offer.id, "soloconfirmar")}>
                                            Confirmar&nbsp; <CheckCircleRounded sx={{ width: 16, height: 16 }} />
                                        </Button>)}

                                    {/* Boton Confirmar y enviar */}
                                    {offer.status !== "enviada" && (
                                        <Button variant="outlined" size="small" color="secondary" sx={styles.button} onClick={() => send(offer.id, "confirmaryenviar")}>
                                            Confirmar y enviar &nbsp; <SendRounded sx={{ width: 16, height: 16 }} />
                                        </Button>)}

                                </Box>

                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Layout>
    )
}
interface CollapsibleDataProps {
    offer: Offer;
}
const CollapsibleData: FC<CollapsibleDataProps> = ({ offer }) => {
    // Control del collapse
    const [expanded, setExpanded] = useState(false);
    let total = 0;
    offer.items.forEach((item) => total = total + item.precio)
    /**
     * Funcion para expandir las opciones del card desplegable
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const localStyles = {
        divider: {
            marginBlock: 2,
        },
        buttonContainer: {
            display: "flex",
            justifyContent: "start",
            flexFlow: "row nowrap"
        }
    }

    return (
        <>
            <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <Typography sx={{ transform: expanded ? "rotate(180deg)" : "rotate(360deg)" }}> {expanded ? "Ocultar" : "Mostrar"} procesos</Typography>
                <ExpandMoreIcon />
            </ExpandMore>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider sx={localStyles.divider} />
                <Typography fontWeight={"bold"} variant="overline" sx={{ mb: 2 }} >Procesos</Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" flexDirection="column">
                    {offer.items.length > 0 && offer.items.map((item, i) => (
                        <Box key={`${item.item_id} ${item.description}`} sx={styles.item}>
                            <Typography variant="subtitle2" fontWeight={"bold"} color="text.primary">{i + 1} Proceso {item.type === "internal" ? "Interno" : "Externo"}</Typography>
                            <Typography variant="subtitle2" fontWeight={400} color="text.primary">{item.description}</Typography>
                            <Typography variant="subtitle2" fontWeight={400} color="text.secondary">Precio $ {numberWithDots(item.precio)}</Typography>
                        </Box>
                    ))}
                    <Typography variant="subtitle1" fontWeight="bold">Precio total $ {numberWithDots(total)}</Typography>
                </Box>
            </Collapse>
        </>
    )
}

const styles = {
    mainContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh",
    },
    offersContainer: {
        width: "100%",
    },
    offerItem: {
        mb: 2,
        width: "100%",
        boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
        background: "rgba(255,255,255,0.6)",
        backdropFilter: 'blur(6px)',
        borderRadius: 5,
        p: 2,
    },
    offerActions: {
        display: "flex",
        justifyContent: "end",
        flexFlow: "row wrap",
        alignItems: "center",
        mt: 2
    },
    item: {
        mb: 1,
    },
    divider: {
        marginBlock: 2
    },
    button: {
        borderRadius: 5,
        textTransform: "none",
        fontSize: 12,
        p: 0.5,
        paddingInline: 1,
        mr: 1,
        display: "flex",
        alignItems: "center"
    },
    chip: {
        mb: 1,

    }
}