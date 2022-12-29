import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { getFormatDistanceToNow, numberWithDots, ucfirst, validarToken } from '../lib/functions';
import { PageTitle } from '../components/ui';
import Chip from '@mui/material/Chip';
import { orange, pink, green, blue, red } from '@mui/material/colors';

interface Item {
    id: number;
    offer_id: number;
    product_id: number;
    description: string;
    descr_larga?: string;
    type: string;
    costo: number;
    precio: number;
}

export interface Offer {
    id: number;
    customer_id: number;
    customer_name: string;
    salesman_id: number;
    salesman_name: string;
    fecha: string;
    status: string;
    items: Item[] | [];
}
export const OfferDetailPage: FC = () => {
    const { id } = useParams();
    const [userLogged, setUserLogged] = useState<User | null>(null);

    const [offer, setOffer] = useState<Offer | null>(null);
    const [items, setItems] = useState<Item[] | null>(null);
    const router = useNavigate()

    const getOffer = async () => {
        const url = `${baseUrl}/consultaoferta?id=${id}`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            console.log("Esto no deberia mostrarse")
            if (data.exito === "SI") {
                setOffer(data.registros[0]);
                setItems(data.registros[0].items);
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "No se logró conectar al servidor",
                icon: "error"
            });
        }
    }

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'nueva':
                return orange[500];
            case 'aprobada':
                return pink[500];
            case 'enviada':
                return green[500]
            case 'confirmada':
                return blue[500];
            default:
                return red[500]
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getOffer();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Detalles de la oferta" />
                <Box sx={{ background: "#FFF", borderRadius: 5, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", mt: 2, p: 2 }}>
                    <Chip variant="outlined" size='small' sx={{ width: 100, mb: 2, color: getColorByStatus(offer ? offer.status : ''), border: `1px solid ${getColorByStatus(offer ? offer.status : '')}` }} label={ucfirst(offer ? offer.status : '')} />
                    <Typography variant="subtitle1">Cliente {offer?.customer_name}</Typography>
                    <Typography variant="subtitle1">Vendedor {offer?.salesman_name}</Typography>
                    <Typography variant="subtitle2" fontWeight={300} color="text.secondary">{offer ? getFormatDistanceToNow(new Date(offer?.fecha)) : ''}</Typography>
                    <Divider sx={{ marginBlock: 2 }} />
                    {offer && (<ItemList items={items} setItems={setItems} />)}
                </Box>
            </Box>
        </Layout>
    )
}

const styles = {
    mainContainer: {
        minHeight: "100vh",
        width: "80%",
        margin: "20px auto",
    },
    offerActions: {
        display: "flex",
        justifyContent: "end",
        flexFlow: "row wrap",
        alignItems: "center",
        mt: 2
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
}

interface ItemListProps {
    items: Item[] | null;
    setItems: Dispatch<SetStateAction<Item[] | null>>;
}
const ItemList: FC<ItemListProps> = ({ items, setItems }) => {

    const [total, setTotal] = useState<number>(0)
    useEffect(() => {
        if (total === 0) {
            items && items.forEach((i) => setTotal(prev => prev + i.precio));
        }
    }, [items])

    return (
        <>
            <Typography variant="overline" fontWeight="bold">Productos de la oferta</Typography>
            {
                items && items.map(i => <ItemCard item={i} items={items} setItems={setItems} key={`${i.id} ${i.description}`} total={total} setTotal={setTotal} />)
            }
            <Typography variant="subtitle1" fontWeight="bold">Precio total ${numberWithDots(total)}</Typography>

        </>
    )
}
interface ItemCardProps {
    item: Item;
    items: Item[] | null;
    setItems: Dispatch<SetStateAction<Item[] | null>>;
    total: number;
    setTotal: Dispatch<SetStateAction<number>>;
}
const ItemCard: FC<ItemCardProps> = ({ item, setItems, items, setTotal, total }) => {
    return (
        <Box sx={{ background: "#FFF", borderRadius: 5, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">{item.description}</Typography>
            <Typography variant="subtitle2" color='text.secondary'>{item.descr_larga}</Typography>
            <Typography variant="subtitle2" color="text.secondary">Tipo: {(item.type === 'external' || item.type === 'Externo') ? 'Externo' : 'Interno'}</Typography>
            <Typography variant="subtitle2" fontWeight={400}>Precio: ${numberWithDots(Number(item.precio))}</Typography>
            <Typography variant="subtitle2" fontWeight={400}>Costo: ${numberWithDots(Number(item.costo))}</Typography>
        </Box>
    )
}