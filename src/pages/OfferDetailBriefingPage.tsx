import Box from '@mui/material/Box';
import { LoadingButton } from "@mui/lab";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { IconButton, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/EditRounded';
import EditOffIcon from '@mui/icons-material/EditOffRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';

import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { getFormatDistanceToNow, numberWithDots, ucfirst, validarToken } from '../lib/functions';
import { PageTitle } from '../components/ui';
import { orange, pink, green, blue, red } from '@mui/material/colors';

interface Item {
   id: number;
   offer_id: number;
   product_id: number;
   description: string;
   descr_larga?: string;
   briefing: string;
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


const guardabriefings = async (items: any) => {

   console.log('items',items);
   // const url = `${baseUrl}/trafico`;
   // let activUsers = "";
   // if (selectedActividades.length < actividades.length) {
   //    Swal.fire({
   //       title: "Error",
   //       text: "Faltan actividades por asignar",
   //       icon: "error",
   //    })
   //    return false;
   // }

   // if (!selectedTask) {
   //    Swal.fire({
   //       title: "Error",
   //       text: "Debe seleccionar una actividad valida",
   //       icon: "error"
   //    })
   //    setIsSubmitting(false);
   // } else {

   //    for (let i = 1; i <= selectedActividades.length; i++) {
   //       const position = i - 1;
   //       activUsers += i === selectedActividades.length ? `${selectedActividades[position].actividadId}*!*${selectedActividades[position].userId}*!*${selectedActividades[position].fecha}*!*${selectedActividades[position].observacion}` : `${selectedActividades[position].actividadId}*!*${selectedActividades[position].userId}*!*${selectedActividades[position].fecha}*!*${selectedActividades[position].observacion},`
   //    }
   //    console.log(activUsers)
   //    const body = new FormData();
   //    body.append("case_id", String(selectedTask ? selectedTask.case_id : ''));
   //    body.append("activ_users", activUsers);
   //    const options = {
   //       method: "POST",
   //       body
   //    }
   //    const respuesta = await fetch(url, options)

   //    const data = await respuesta.json();

   //    if (data.exito === "SI") {
   //       Swal.fire({
   //          title: "Exito",
   //          text: "Se han asignado los usuarios",
   //          icon: "success",
   //       })
   //       resetEverything();
   //       getMyRequirements();
   //       setIsSubmitting(false);
   //    } else {
   //       Swal.fire({
   //          title: "Error",
   //          text: data.mensaje,
   //          icon: "error",
   //       })
   //       setIsSubmitting(false);
   //    }
   // }
}

export const OfferDetailBriefing: FC = () => {
   const { id } = useParams();
   const [userLogged, setUserLogged] = useState<User | null>(null);

   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
   }, [])

   return (
      <Layout user={userLogged}>
         <Box sx={styles.mainContainer}>
            <PageTitle title="Detalles de la oferta" />
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

   // useEffect(() => {
   //    if (total === 0) {
   //       items && items.forEach((i) => setTotal(prev => prev + i.precio));
   //    }
   // }, [items])

   return (
      <>
         <Typography variant="overline" fontWeight="bold">Productos de la oferta</Typography>
         {
            items && items.map(i => <ItemCard item={i} items={items} setItems={setItems} />)
         }
         <LoadingButton color="secondary" variant="contained" onClick={() => { guardabriefings(items)}} fullWidth sx={{ p: 2, borderRadius: 5, textTransform: "none", marginTop: 2 }} disableElevation >Guardar</LoadingButton>
      </>
   )
}
interface ItemCardProps {
   item: Item;
   items: Item[] | null;
   setItems: Dispatch<SetStateAction<Item[] | null>>;
}
const ItemCard: FC<ItemCardProps> = ({ item, items, setItems }) => {
   const [edit, setEdit] = useState<boolean>(false);
   const [briefing, setBriefing] = useState<string>('');

   const handleChangeBriefing = (e: ChangeEvent<HTMLInputElement>) => {
      setBriefing(e.target.value);
   }

   const save = () => {
      // setItems({briefing: briefing})
      setEdit(false);
   }

   return (
      <Box sx={{ background: "#FFF", borderRadius: 5, mb: 1 }}>
         <Typography variant="subtitle1" fontWeight="bold">{item.description}</Typography>
         <Typography variant="subtitle2" color='text.secondary'>{item.descr_larga}</Typography>
         <Typography variant="subtitle2" color="text.secondary">Tipo: {item.type === 'external' ? 'Externo' : 'Interno'}</Typography>
         {edit ? (
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
               <IconButton onClick={() => setEdit(false)} color="error"><EditOffIcon /></IconButton>
               <TextField label="Briefing" multiline fullWidth color="secondary" variant="outlined" value={briefing} onChange={handleChangeBriefing} />
               <IconButton onClick={save} color="success" ><SaveIcon /></IconButton>
            </Box>
         ) : (
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
               <Typography variant="subtitle2" color="text.secondary">Briefing: {briefing}</Typography>
               <IconButton onClick={() => setEdit(true)} > <EditIcon /></IconButton>
            </Box>
         )}
      </Box>
   )
}