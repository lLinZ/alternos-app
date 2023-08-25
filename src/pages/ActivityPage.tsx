import { AddCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { ActivityCard } from '../components/activity/ActivityCard';
import { FilterBox } from '../components/data/FilterBox';
import { Layout } from '../components/layout';
import { PageTitle } from '../components/ui';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import { Actividades } from './ActivityAddingPage';

interface Props {

}

export const ActivityPage: FC<Props> = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);

    const [actividades, setActividades] = useState<Actividades[] | null>(null)

    // Parámetros
    const [valorhora, setValorhora] = useState(1);
    const [factorprecio, setFactorprecio] = useState(1);
    
    const router = useNavigate();

    const getDepartamentos = async () => {
        const url = `${baseUrl}/listafunctions`;

        const respuesta = await fetch(url);

        const data = await respuesta.json();

        if (data.exito === "SI") {
            setValorhora(data.valorhora);
            setFactorprecio(data.factorprecio);
        }
    }

    const getActividades = async () => {
        const url = `${baseUrl}/listaactividades`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            if (data.exito === "SI") {
                setActividades(data.actividades)
                console.log(data.actividades)
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
        getDepartamentos();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <PageTitle title="Lista de Actividades" navigate='/activity/add' />
                {actividades && (<FilterBox data={actividades} setData={setActividades} category1="name" category2='precio' category3='costo' category4='owner_name' />)}
                {
                    actividades && actividades.map((actividad: Actividades) => (
                        <ActivityCard 
                            key={actividad.id} 
                            actividades={actividades} 
                            setActividades={setActividades} 
                            actividad={actividad} 
                            valorhora={valorhora} 
                            factorprecio={factorprecio} 
                        />
                    ))
                }
            </Box>
        </Layout>
    )
}
