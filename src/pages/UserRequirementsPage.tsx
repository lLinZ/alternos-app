import { FC, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';

// Requerimientos
export interface IRequirements {
    id: number;
    user_id: number;
    user_name: string;
    description: string;
    process_id: number;
    process_name: string;
    process_owner_id: string;
    process_owner_name: string;
    activity_id: number;
    activity_name: string;
    activity_owner_id: number;
    activity_owner_name: string;
    status: string;
    inicio: string;
    vence: string;
    completed_at: string;
    comentario_cierre: string;
}
export const UserRequirementsPage: FC = () => {

    // Datos del usuario loggeado
    const [userLogged, setUserLogged] = useState<User | null>(null);

    // Mis requerimientos
    const [myRequirements, setMyRequirements] = useState<IRequirements[] | null>(null);

    // Router
    const router = useNavigate();

    /**
     * Funcion para obtener los requerimientos
     */
    const getMyRequirements = async () => {
        const url = `${baseUrl}/listatareas?user_id=${userLogged ? userLogged.id : "1"}&status=`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setMyRequirements(data.exito.registros);
            } else {
                console.log("Ocurrio un error al solicitar la informacion de las tareas");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])

    // Render
    return (
        <Layout title="Mis tareas" user={userLogged}>
            <Box>
                {
                    myRequirements && myRequirements.map(req => (
                        <Card variant="outlined">
                            <CardHeader>
                                <Typography variant="subtitle1">
                                    {req.process_name}
                                </Typography>
                            </CardHeader>
                            <CardContent>
                                <Box>
                                    <Typography variant="subtitle2">
                                        {req.description}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="secondary">Ver más</Button>
                            </CardActions>
                        </Card>
                    ))
                }
            </Box>
        </Layout>
    )
}