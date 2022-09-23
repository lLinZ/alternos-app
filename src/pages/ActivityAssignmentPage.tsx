import { useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/layout'
import { validarToken } from '../lib/functions';

import { User } from '../interfaces/user-type';

export const ActivityAssignmentPage = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);

    const router = useNavigate();

    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Asignacion de actividades</Typography>
            </Box>
        </Layout>
    )
}
