import { AddCircleOutlineRounded, AddCircleRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';

const registrosDePrueba = [
  {
    id: 1,
    name: 'Titulo grande',
    subtitle: 'Subtitulo',
    caracteristica1: 'Este es un dato adicional 1',
    caracteristica2: 'Este es un dato adicional 2',
  },
  {
    id: 2,
    name: 'Titulo grande',
    subtitle: 'Subtitulo',
    caracteristica1: 'Este es un dato adicional 1',
    caracteristica2: 'Este es un dato adicional 2',
  },
  {
    id: 3,
    name: 'Titulo grande',
    subtitle: 'Subtitulo',
    caracteristica1: 'Este es un dato adicional 1',
    caracteristica2: 'Este es un dato adicional 2',
  },
  {
    id: 4,
    name: 'Titulo grande',
    subtitle: 'Subtitulo',
    caracteristica1: 'Este es un dato adicional 1',
    caracteristica2: 'Este es un dato adicional 2',
  },
]

export const RegistrosPage: FC = () => {
  const [userLogged, setUserLogged] = useState<User | null>(null);
  const router = useNavigate();
  const [registros, setRegistros] = useState<any | null>(null)

  const getRegistros = async () => {
    const url = `${baseUrl}/`
    try {
      const respuesta = await fetch(url);
      const data = await respuesta.json();

      if (data.exito === 'SI') {
        setRegistros(data.registros)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // validarToken(router, setUserLogged)
    // getRegistros()
  }, [])
  return (
    <Layout user={userLogged}>
      <Box sx={styles.mainContainer}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="overline" fontWeight={"bold"}>Registros encontrados</Typography>
          <IconButton size="small" color="info"><AddCircleOutlineRounded /></IconButton>
        </Box>
        {registrosDePrueba.map((reg: any) => (
          <Box key={reg.id} sx={styles.registroBox}>
            <Typography variant="subtitle1" fontWeight={'bold'}>{reg.name}</Typography>
            <Typography variant="subtitle2" fontWeight={500}>{reg.subtitle}</Typography>
            <Typography variant="subtitle2" color="text.secondary">{reg.caracteristica1}</Typography>
            <Typography variant="subtitle2" color="text.secondary">{reg.caracteristica2}</Typography>
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
    borderRadius: 5,
    background: "#FFF",
    p: 2,
    mb: 2,
    "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.2)" }
  }
}