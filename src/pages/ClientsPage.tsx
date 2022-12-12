import FeedIcon from '@mui/icons-material/Feed';
import { Chip, Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../common/baseUrl';
import { FilterBox } from '../components/data/FilterBox';
import { Layout } from '../components/layout';
import { PageTitle } from '../components/ui';
import { Client } from '../interfaces/client-type';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';

export const ClientsPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const router = useNavigate();
    const [clients, setClients] = useState<Client[] | null>(null)

    const getClients = async () => {
        const url = `${baseUrl}/listaclientes`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === 'SI') {
                setClients(data.registros)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        validarToken(router, setUserLogged)
        getClients()
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <PageTitle title="Listado de clientes" />
                {clients && (<FilterBox data={clients} setData={setClients} category1='name' category2='status' category3='phone' />)}
                {clients && clients.map((reg: any) => (
                    <Box key={reg.id} sx={styles.registroBox}>
                        <Box>
                            <Chip variant="outlined" color='info' label={reg.status} />
                            <Typography variant="subtitle1" fontWeight={'bold'}>{reg.name}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{reg.phone}</Typography>
                        </Box>
                        <IconButton color="info" onClick={() => router(`/ficha/${reg.id}`)}><FeedIcon /></IconButton>
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
        justifyContent: "space-between",
        alignItems: "center",
        "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.2)" }
    }
}