import SendIcon from '@mui/icons-material/SendRounded';
import CancelIcon from '@mui/icons-material/CancelRounded';
import PayedIcon from '@mui/icons-material/MoneyRounded';
import NotEmitedIcon from '@mui/icons-material/ErrorRounded';
import { Divider, Chip, Box, Button, Typography } from '@mui/material';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { FilterBox } from '../../components/data/FilterBox';
import { Layout } from '../../components/layout';
import { PageTitle } from '../../components/ui';
import { User } from '../../interfaces/user-type';
import { numberWithDots, ucfirst, validarToken } from '../../lib/functions';
import { green, blue, red, orange, pink } from '@mui/material/colors';
import Swal from 'sweetalert2';
import { Offer } from './RegistroOfferPage';

export const RegistroBriefingsPage: FC = () => {
   const [userLogged, setUserLogged] = useState<User | null>(null);
   const router = useNavigate();
   const [offers, setOffers] = useState<Offer[] | null>(null)

   const getOffers = async () => {
      const url = `${baseUrl}/listaofertasbriefings`
      try {
         const respuesta = await fetch(url);
         const data = await respuesta.json();

         if (data.exito === 'SI') {
            setOffers(data.registros)
         }
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      validarToken(router, setUserLogged)
      getOffers()
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
            getOffers();
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
   return (
      <Layout user={userLogged}>
         <Box sx={styles.mainContainer}>
            <PageTitle title="Lista de ofertas" />
            {offers && (<FilterBox data={offers} setData={setOffers} category1='precio_oferta' category2='customer_name' category3='salesman_name' category4='status' />)}
            {offers && offers.map((reg) => (
               <Box key={reg.id} sx={styles.registroBox}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">#{reg.id}</Typography>
                  <Typography variant="subtitle2">Comprador {reg.customer_name}</Typography>
                  <Typography variant="subtitle2">Vendedor {reg.salesman_name}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">Fecha {moment(reg.fecha).format("DD-MM-YYYY")}</Typography>
                  <Box sx={styles.actions}>
                     <Button sx={styles.button} variant="outlined" color="secondary" onClick={() => router(`/requirements/offer/${reg.id}`)}>Ver detalles</Button>
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