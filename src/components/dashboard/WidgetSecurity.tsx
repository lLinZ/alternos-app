import React, { FC, useEffect, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import moment from 'moment';
interface Props {

}
interface IAnnouncement {
    texto: string;
    imagen: string;
    hasta: string;
    url: string;
    desde: string;
    status: string;
}
export const WidgetSecurity: FC<Props> = () => {
    const [dismissed, setDismissed] = useState<string>("block");
    // const [image, setImage] = useState<string>("./security.jpg");
    const [text, setText] = useState<string>("");
    const [announcement, setAnnouncement] = useState<IAnnouncement>({
        texto: 'En la opción "Mi perfil" en el menú de usuario puedes modificarla cuando quieras',
        url: './security.jpg',
        imagen: './security.jpg',
        hasta: '',
        desde: '',
        status: 'Activo'
    })
    console.log({ announcement })
    const getAnnouncement = async () => {
        const url = `${baseUrl}/consultaanuncio`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === 'SI') {
                if (moment(data.registros[0].hasta).date <= moment().date) {
                    setAnnouncement(data.registros[0])
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const router = useNavigate();
    useEffect(() => {
        getAnnouncement();
    }, [])
    return (
        <Box sx={{ position: "relative", display: dismissed, width: "100%", mt: -5 }}>
            <IconButton sx={{ position: "absolute", top: 0, right: 5, zIndex: 90 }} onClick={() => setDismissed('none')}><CloseRounded /></IconButton>
            <Box sx={{ width: "100%", height: "100%", background: "#FFF", overflow: "hidden", cursor: "pointer", boxShadow: 'inset 0 0 10px rgba(100,100,100,0.1)', "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, position: "relative", backdropFilter: 'blur(8px)' }}>
                <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", alignItems: "center", width: "100%", backgroundColor: "#ffc107", color: "black" }}>
                    {/* <img src={announcement.url} style={{ width: 125 }} /> */}
                    <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" textAlign="left" color="black" fontSize={{ xs: 12, md: 14 }}>{announcement.texto}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
