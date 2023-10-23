import React, { FC, useEffect, useState } from 'react'
import { Box, Chip, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import { blue, grey, yellow } from '@mui/material/colors';
import { Case } from '../../interfaces/requirement-type';
import { ucfirst } from '../../lib/functions';

interface Props {
    user: User | null;
}
export const WidgetCasosAbiertos: FC<Props> = ({ user }) => {
    const [casos, setCasos] = useState<Case[] | null>(null)
    const router = useNavigate();

    const getCasos = async () => {
        const url = `${baseUrl}/listacasos`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setCasos(data.registros);
                console.log({ data })
            } else {
                console.log("Ocurrio un error al solicitar la informacion del estado de cuenta");
                console.log({ data })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!casos) {
            getCasos();
        }
    });

    const styles = {
        mainContainer: {
            borderRadius: 5,
            m: 1,
            p: 2,
            minWidth: { xs: "100%", sm: 450 },
            maxWidth: { xs: "100%", sm: 450 },
            background: "#FFF",
            minHeight: 250,
            maxHeight: 250,
            overflowY: "scroll",
            flexFlow: "column wrap",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
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
            },
            cursor: "pointer",
        },
    }
    return (
        <Box sx={styles.mainContainer} onClick={() => router("/requirements/resume")}>
            <Typography variant="overline" fontWeight="bold">Requerimientos</Typography>

            <Box id="title" sx={{ pt: 2, pl: 2 }}>
            </Box>
            {
                casos && casos.map((c) => (
                    <CaseCard key={c.id} caso={c} />
                ))
            }{
                !casos && (
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">No hay requerimientos abiertos</Typography>
                )
            }
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
                return green[500]
            case 'abierto':
                return blue[500]
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
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: 'flex-start', justifyContent: "start" }}>
                <Chip size="small" sx={{ boxShadow: `0 0 8px ${getColorByStatus(caso.status)}`, color: "white", background: `${getColorByStatus(caso.status)}`, flex: 2 }} label={ucfirst(caso.status)} />
                <Box sx={{ display: "flex", flexFlow: "column wrap", ml: 2, flex: 6 }}>

                    <Typography variant="subtitle1" fontWeight="bold">{caso.description}</Typography>
                    <Typography variant="subtitle2">Encargado {caso.user_name}</Typography>
                </Box>
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
        </>
    )
}