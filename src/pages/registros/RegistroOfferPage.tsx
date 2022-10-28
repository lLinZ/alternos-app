import { FC, useEffect, useState } from 'react';

import { Layout } from '../../components/layout';
import { User } from '../../interfaces/user-type';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { getFormatDistanceToNow, numberWithDots, ucfirst, validarToken } from '../../lib/functions';
import Typography from '@mui/material/Typography';
import { baseUrl } from '../../common/baseUrl';
import Swal from 'sweetalert2';
import { Button, Collapse, Divider, IconButton, IconButtonProps, styled } from '@mui/material';
import SendRounded from '@mui/icons-material/SendRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';


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

export const RegistroOfferPage: FC = () => {

    const [offers, setOffers] = useState<Offer[] | null>(null);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const router = useNavigate()


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
    // function res($response) {
    //     return echo json_encode($response, JSON_UNESCAPED_UNICODE);
    // }
    // if(isset($_POST['id'])){ $id = mysqli_real_escape_string($_POST["id"]);}
    // if(isset($_POST['accion'])){ $accion = mysqli_real_escape_string($_POST["accion"]);}

    // $respuesta = [];

    // if(empty($_POST['id'])){
    //     $respuesta['exito'] = 'NO';
    //     $respuesta['mensaje'] = 'El id es obligatorio';
    //     res($respuesta);
    // } 

    // switch($accion){
    //     case 'soloconfirmar':
    //         $sql = "UPDATE `ofertas` status = 'confirmada' WHERE id = $id";
    //         $query = mysqli_query($link, $sql);
    //         if($query){
    //             $respuesta['exito'] = 'SI';
    //             $respuesta['mensaje'] = 'Se ha confirmado la oferta';
    //         } else {
    //             $respuesta['exito'] = 'NO';
    //             $respuesta['mensaje'] = 'No se confirmó la oferta';
    //         }
    //         return res($response);
    //     case 'confirmaryenviar':
    //         $sql = "UPDATE `ofertas` status = 'enviada' WHERE id = $id";
    //         $query = mysqli_query($link, $sql);
    //         if($query){
    //             $respuesta['exito'] = 'SI';
    //             $respuesta['mensaje'] = 'Se ha confirmado y enviado la oferta';
    //         } else {
    //             $respuesta['exito'] = 'NO';
    //             $respuesta['mensaje'] = 'No se confirmó ni se envió la oferta';
    //         }
    //         return res($response);
    //     default:
    //         $respuesta['exito'] = 'NO';
    //         $respuesta['mensaje'] = 'Accion inválida';
    //         return res($response);
    // }



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
                <Typography variant="overline" fontWeight="bold" fontSize={16}>Resumen de ofertas</Typography>
                <Box sx={styles.offersContainer}>
                    {
                        offers && offers.map((offer) => (
                            <Box key={offer.id} sx={styles.offerItem}>
                                <Typography variant="subtitle2" fontWeight={400} color="text.secondary">{ucfirst(offer.status.toLowerCase())}</Typography>
                                <Typography variant="subtitle1">Cliente {offer.customer_name}</Typography>
                                <Typography variant="subtitle1">Vendedor {offer.salesman_name}</Typography>
                                <Typography variant="subtitle2" fontWeight={300} color="text.secondary">{getFormatDistanceToNow(new Date(offer.created_at))}</Typography>

                                <CollapsibleData offer={offer} />
                                <Box sx={styles.offerActions}>
                                    {/* Boton confirmar */}
                                    {offer.status !== "enviada" && offer.status !== "confirmada" && (
                                        <Button variant="outlined" color="secondary" sx={styles.button} onClick={() => send(offer.id, "soloconfirmar")}>
                                            Confirmar&nbsp; <CheckCircleRounded />
                                        </Button>)}

                                    {/* Boton Confirmar y enviar */}
                                    {offer.status !== "enviada" && (
                                        <Button variant="outlined" color="secondary" sx={styles.button} onClick={() => send(offer.id, "confirmaryenviar")}>
                                            Confirmar y enviar &nbsp; <SendRounded />
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
        background: "#FFF",
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
        p: 1,
        paddingInline: 2,
        mr: 1,
        display: "flex",
        alignItems: "center"
    }
}