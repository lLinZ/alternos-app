import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditRounded'
import EditOffIcon from '@mui/icons-material/EditOffRounded'
import SaveIcon from '@mui/icons-material/SaveRounded'

import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { getFormatDistanceToNow, numberWithDots, validarToken } from '../lib/functions';

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
export const EditOfferPage: FC = () => {
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
    useEffect(() => {
        validarToken(router, setUserLogged);
        getOffer();
        if (userLogged && userLogged?.function_name !== 'Tráfico' && userLogged?.role_name !== 'Administrador') {
            router("/end");
            // console.log("Usuario", userLogged)
        }
    }, [userLogged])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight="bold">Edicion de oferta</Typography>
                <Box sx={{ background: "#FFF", borderRadius: 5, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", mt: 2, p: 2 }}>
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
    }
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
                items && items.map(i => <ItemCard item={i} items={items} setItems={setItems} key={`${i.id} ${i.description}`} />)
            }
            <Typography variant="subtitle1" fontWeight="bold">Precio total ${numberWithDots(total)}</Typography>
        </>
    )
}
interface ItemCardProps {
    item: Item;
    items: Item[] | null;
    setItems: Dispatch<SetStateAction<Item[] | null>>;
}
const ItemCard: FC<ItemCardProps> = ({ item, setItems, items }) => {
    const [editPrice, setEditPrice] = useState<boolean>(false);
    const [editCost, setEditCost] = useState<boolean>(false);
    const [newPrice, setNewPrice] = useState<string>(String(item.precio));
    const [newCost, setNewCost] = useState<string>(String(item.costo));

    const saveCost = () => {
        if (item) {

            const excludeItem = items?.filter(i => i.id !== item.id);
            const newItems = excludeItem ? [...excludeItem, { ...item, costo: newCost }] : [{ ...item, costo: newCost }]
            newItems.sort((a, b) => a.id - b.id);
            setEditCost(false);
        } else {
            return false;
        }
    }
    const savePrice = () => {
        if (item) {
            const excludeItem = items?.filter(i => i.id !== item.id);
            const newItems = excludeItem ? [...excludeItem, { ...item, precio: newPrice }] : [{ ...item, precio: newPrice }]
            newItems.sort((a, b) => a.id - b.id);
            setEditPrice(false);
        } else {
            return false;
        }
    }
    return (
        <Box sx={{ background: "#FFF", borderRadius: 5, mb: 1 }}>
            <Typography variant="subtitle1">{item.description}</Typography>
            <Typography variant="subtitle2">{item.descr_larga}</Typography>
            <Typography variant="subtitle2">Tipo: {item.type === 'external' ? 'Externo' : 'Interno'}</Typography>
            {
                editPrice ? (
                    <Box sx={{ display: "flex", alignItems: "center", marginBlock: 1 }}>
                        <IconButton onClick={() => setEditPrice(false)} color="error" ><EditOffIcon /></IconButton>
                        <TextField size="small" label="Precio" value={newPrice} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPrice(String(e.target.value))} />
                        <IconButton onClick={savePrice} color="success" ><SaveIcon /></IconButton>
                    </Box>
                )
                    : (
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <Typography variant="subtitle2" fontWeight={400}>Precio: ${numberWithDots(Number(item.precio))}</Typography>
                            <IconButton size="small" onClick={() => setEditPrice(true)} color="secondary" ><EditIcon sx={{ width: 16, height: 16 }} /></IconButton>
                        </Box>
                    )
            }
            {
                editCost ? (
                    <Box sx={{ display: "flex", alignItems: "center", marginBlock: 1 }}>
                        <IconButton onClick={() => setEditPrice(false)} color="error" ><EditOffIcon /></IconButton>
                        <TextField size="small" label="Costo" value={newCost} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCost(String(e.target.value))} />
                        <IconButton onClick={saveCost} color="success" ><SaveIcon /></IconButton>
                    </Box>
                )
                    : (
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                            <Typography variant="subtitle2" fontWeight={400}>Costo: ${numberWithDots(Number(item.costo))}</Typography>
                            <IconButton size="small" onClick={() => setEditPrice(true)} color="secondary" ><EditIcon sx={{ width: 16, height: 16 }} /></IconButton>
                        </Box>
                    )
            }
        </Box>
    )
}