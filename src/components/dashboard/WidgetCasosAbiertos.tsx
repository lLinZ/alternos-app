import { FC, useEffect, useState } from 'react'
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import { grey, yellow } from '@mui/material/colors';

interface Case {
    id: number;
    description: string;
    user_id: number;
    user_name: string;
    process_id: number;
    process_name: string;
    process_owner_id: number;
    process_owner_name: string;
    status: string;
    inicio: Date;
    vence: Date;
    completed_at: string;
    comentario_cierre: string;
}

interface Props {
    user: User | null;
}
export const WidgetCasosAbiertos: FC<Props> = ({ user }) => {
    const [casos, setCasos] = useState<Case[] | null>(null)
    const theme = useTheme();
    const router = useNavigate();
    useEffect(() => {
        getCasos();
    }, []);

    const getCasos = async () => {
        if (!user) return false;
        const url = `${baseUrl}/listacasos`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setCasos(data.registros);
                console.log(data)
            } else {
                console.log("Ocurrio un error al solicitar la informacion del estado de cuenta");
                console.log({ data })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box display="flex" flexDirection="column" sx={{ minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, m: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)', background: theme.palette.common.white, borderRadius: 5, overflow: "hidden", cursor: "pointer", transition: ".3s ease all", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, minHeight: 250, maxHeight: 250 }}
            onClick={() => router("/users/estadocuenta")}
        >
            <Box id="title" sx={{ pt: 2, pl: 2 }}>
                <Typography variant="overline" fontWeight="bold">Casos</Typography>
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
                {
                    casos && casos.map((c) => (
                        <CaseCard caso={c} />
                    ))
                }
            </Box>
        </Box>
    )
}

interface CaseCardProps {
    caso: Case;
}
export const CaseCard: FC<CaseCardProps> = ({ caso }) => {

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completado':
                return grey[900]
            case 'abierto':
                return green[500]
            case 'por vencer':
                return yellow[500];
            case 'vencido':
                return red[500];
            default:
                return grey[500]
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems:'flex-start', justifyContent:"start" }}>
                <Box sx={{ boxShadow: `0 0 8px ${getColorByStatus(caso.status)}`, borderRadius:1, background: `${getColorByStatus(caso.status)}`, flex: 1, width:10, height:10 }}></Box>
                <Box sx={{ display: "flex", flexFlow: "column wrap", ml: 2, flex: 6 }}>

                    <Typography variant="subtitle1" fontWeight="bold">{caso.description}</Typography>
                    <Typography variant="subtitle2">Encargado {caso.user_name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">Status {caso.status}</Typography>
                </Box>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}