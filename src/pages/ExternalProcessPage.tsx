import { AddCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { Process } from '../interfaces/process-type';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';

interface Props {

}

export const ExternalProcessPage: FC<Props> = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);

    const [process, setProcess] = useState<Process[] | null>(null)

    const router = useNavigate();

    const getProcess = async () => {
        const url = `${baseUrl}/listaprocesosexternos`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            if (data.exito === "SI") {
                setProcess(data.registros)
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se encontraron los procesos",
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
        getProcess();
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography component="h2" fontWeight="bold" variant="overline" >Lista de procesos externos</Typography>
                    <IconButton color="secondary" size="small" onClick={() => router("/process/external/add")}>
                        <Tooltip title="Añadir proceso externo">
                            <AddCircleOutline color="info" />
                        </Tooltip>
                    </IconButton>
                </Box>
                {
                    process && process.map((proceso: Process) => (
                        <Box key={proceso.id} sx={{
                            p: 2, borderRadius: 5, mb: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)',
                        }}>
                            <Typography variant="subtitle1" fontWeight={"bold"}>{proceso.name}</Typography>
                            <Typography variant="subtitle2" fontWeight={400} color="text.primary">{proceso.owner_name}</Typography>
                            <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Costo {proceso.costo}</Typography>
                            <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Precio {proceso.precio}</Typography>
                            <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Centro de costo 1: {proceso.centrodecosto1}</Typography>
                            <Typography variant="subtitle2" fontWeight={300} color="text.secondary">Centro de costo 2: {proceso.centrodecosto2}</Typography>
                        </Box>
                    ))
                }
            </Box>
        </Layout>
    )
}
