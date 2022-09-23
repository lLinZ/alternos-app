import { AddCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import { Actividades } from './ActivityAddingPage';

interface Props {

}

export const ActivityPage: FC<Props> = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);

    const [actividades, setActividades] = useState<Actividades[] | null>(null)

    const router = useNavigate();

    const getActividades = async () => {
        const url = `${baseUrl}/listaactividades`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            if (data.exito === "SI") {
                setActividades(data.actividades)
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se encontraron las actividades",
                    icon: "error",
                })
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error",
            })
        }

    }

    useEffect(() => {
        validarToken(router, setUserLogged);
        getActividades();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Lista de Actividades</Typography>
                    <IconButton color="secondary" onClick={() => router("/activity/add")}>
                        <AddCircleOutline />
                    </IconButton>
                </Box>
                {
                    actividades && actividades.map((actividad: Actividades) => (
                        <Box key={actividad.id} sx={{ p: 2, border: "1px solid rgb(0,0,0,0.3)", borderRadius: 2, mb: 1 }}>
                            <Typography>{actividad.name}</Typography>
                        </Box>
                    ))
                }
            </Box>
        </Layout>
    )
}
