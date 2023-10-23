import Box from '@mui/material/Box';
import { LoadingButton } from "@mui/lab";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { IconButton, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/EditRounded';
import EditOffIcon from '@mui/icons-material/EditOffRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';
import moment from 'moment';

import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { getFormatDistanceToNow, validarToken } from '../lib/functions';
import { PageTitle } from '../components/ui';

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
            console.log({ data })
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
               <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Fecha {moment(offer?.fecha).format("DD-MM-YYYY")}</Typography>
               {/* <Typography variant="subtitle2" fontWeight={300} color="text.secondary">{offer ? getFormatDistanceToNow(new Date(offer?.fecha)) : ''}</Typography> */}
               <Divider sx={{ marginBlock: 2 }} />
               {offer && (<ItemList items={items} setItems={setItems} offer={offer} userLogged={userLogged} />)}
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
   offer: Offer | null;
   userLogged: User | null;
}
const ItemList: FC<ItemListProps> = ({ items, setItems, offer, userLogged }) => {

   const [selectedActividades, setSelectedActividades] = useState<any>(items);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   const router = useNavigate()

   const guardabriefings = async (items: any) => {
      setIsSubmitting(true);
      const url = `${baseUrl}/briefingporoferta`;

      let offerData = [];
      for (let i = 1; i <= selectedActividades.length; i++) {
         const position = i - 1;
         offerData.push({ id: selectedActividades[position].id, briefing: selectedActividades[position].briefing ? selectedActividades[position].briefing : '' })
      }
      const body = JSON.stringify({
         user_id: userLogged?.id,
         offer_id: offer?.id,
         briefings: offerData,
      })
      console.log({
         user_id: userLogged?.id,
         offer_id: offer?.id,
         briefings: offerData,
      })
      const options = {
         method: "POST",
         body
      }
      const respuesta = await fetch(url, options)

      const data = await respuesta.json();

      if (data.exito === "SI") {
         Swal.fire({
            title: "Exito",
            text: "Se han asignado los briefings",
            icon: "success",
         })
         router("/requirements/briefings");
         setIsSubmitting(false);
      } else {
         Swal.fire({
            title: "Error",
            text: data.mensaje,
            icon: "error",
         })
         setIsSubmitting(false);
      }

   }
   return (
      <>
         <Typography variant="overline" fontWeight="bold">Productos de la oferta</Typography>
         {
            items && items.map(i => <ItemCard item={i} items={items} selectedActividades={selectedActividades} setSelectedActividades={setSelectedActividades} />)
         }
         <LoadingButton color="secondary" variant="contained" onClick={() => { guardabriefings(items) }} fullWidth sx={{ p: 2, borderRadius: 5, textTransform: "none", marginTop: 2 }} disableElevation >Guardar</LoadingButton>
      </>
   )
}
interface ItemCardProps {
   item: Item;
   items: Item[] | null;
   selectedActividades: any;
   setSelectedActividades: Dispatch<any>;
}
const ItemCard: FC<ItemCardProps> = ({ item, items, setSelectedActividades, selectedActividades }) => {
   const [edit, setEdit] = useState<boolean>(false);
   const [briefing, setBriefing] = useState<string>('');

   const handleChangeBriefing = (e: ChangeEvent<HTMLInputElement>) => {
      setBriefing(e.target.value);
   }

   const save = () => {
      const excludeActividades = selectedActividades ? selectedActividades.filter((sa: any) => sa.id !== item.id) : false;
      if (excludeActividades) {
         setSelectedActividades([...excludeActividades, { ...item, briefing }]);
         setEdit(false);
      } else {
         setSelectedActividades([{ ...item, briefing }]);
         setEdit(false);
      }
   }

   return (
      <Box key={item.id} sx={{ background: "#FFF", borderRadius: 5, mb: 1 }}>
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