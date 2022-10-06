import { FC, useEffect, useState } from 'react'
import { Divider, Box, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { getCookieValue } from '../../lib/functions';
import { IRequirement } from '../../pages/UserRequirementsPage';

interface Props {

}
export const WidgetListaTareas: FC<Props> = () => {
    const [myRequirements, setMyRequirements] = useState<IRequirement[] | null>(null)
    const theme = useTheme();
    const router = useNavigate();
    useEffect(() => {
        getMyRequirements();
    }, []);

    const getMyRequirements = async () => {
        const token = getCookieValue("token");
        const username = getCookieValue("username");
        const urlUser = `${baseUrl}/validToken`;
        const body = new FormData();
        body.append("token", token);
        body.append("username", username);
        const options = {
            method: "POST",
            body
        }
        try {
            const userResponse = await fetch(urlUser, options)
            const userDataArray = await userResponse.json();
            if (userDataArray.exito === "SI") {
                const userData = userDataArray.usuario;
                const url = userData.function_id !== 2 ? `${baseUrl}/listatareas?owner_id=${userData.id}&status=pendiente` : "https://alternos.sgc-consultores.com.ve/api/listarequerimientos?status=pendiente";
                try {
                    const respuesta = await fetch(url);
                    const data = await respuesta.json();
                    if (data.exito === "SI") {
                        setMyRequirements(data.registros);

                        console.log(data)
                    } else {
                        console.log("Ocurrio un error al solicitar la informacion de las tareas");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log({ userDataArray })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box display="flex" flexDirection="column" sx={{ minWidth: 400, mr: 1, mb: 1, background: theme.palette.common.white, borderRadius: 5, overflow: "hidden", cursor: "pointer", transition: ".3s ease all", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" } }}
            onClick={() => router("/requirements")}
        >
            <Box id="title" sx={{ pt: 2, pl: 2 }}>
                <Typography variant="overline" fontWeight="bold">Lista de tareas</Typography>
            </Box>
            <Box id="content" sx={{
                p: 2, minHeight: "200px", maxHeight: "300px", overflowY: "scroll",
                '&::-webkit-scrollbar': {
                    width: '0.2em',
                    height: "10px",
                    borderRadius: "10px"
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: "none",
                    webkitBoxShadow: "none"
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    outline: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: "10px",
                    height: "10px"
                }
            }}>
                {myRequirements ? myRequirements.map(req => (
                    <Box key={req.id} sx={{ boxShadow: "0 0 5px rgba(0,0,0,0.1)", borderRadius: 5, p: 2, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" >{req.process_name} #{req.case_id}</Typography>
                        <Typography variant="subtitle2" fontSize={12} fontWeight="300">{req.description}</Typography>
                    </Box>
                ))
                    : <Typography variant="subtitle1"> No tienes tareas asignadas</Typography>
                }
            </Box>
        </Box>
    )
}
