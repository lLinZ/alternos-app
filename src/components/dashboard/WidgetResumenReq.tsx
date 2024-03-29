import React, { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { baseUrl } from '../../common/baseUrl';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ucfirst } from '../../lib/functions';
import 'react-circular-progressbar/dist/styles.css';
import { yellow, green, blue, red } from '@mui/material/colors';
interface IResumenReq {
    status: string;
    cantidad: number;
    avance: number;
}
export const WidgetResumenReq: FC = () => {

    const [stats, setStats] = useState<IResumenReq[] | null>(null)
    const [total, setTotal] = useState<number>(0);


    const getStats = async () => {
        const url = `${baseUrl}/resumenrequerimientos`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        setStats(data.registros)
        let xCant = 0;
        data.registros.map((elemento:any) => {
            xCant += elemento.cantidad 
        });
        // setTotal(data.registros[0].monto + data.registros[1].monto)
        // let aux = data.registros[0].cantidad + data.registros[1].cantidad + data.registros[2].cantidad + data.registros[3].cantidad;
        setTotal(xCant)
    }
    useEffect(() => {
        getStats();
    }, [])
    const styles = {
        mainContainer: {
            borderRadius: 5,
            m: 1,
            p: 2,
            minWidth: { xs: "100%", sm: 450 },
            maxWidth: { xs: "100%", sm: 450 },
            background: "#FFF",
            minHeight: 300,
            maxHeight: 300,
            flexFlow: "column wrap",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)'
        },
        contentContainer: {
            p: 1,
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px", maxHeight: "300px", overflowY: "scroll",
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
        }
    }

    const getColorByStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'abierto':
                return yellow[500]
            case 'completado':
                return green[500]
            case 'en proceso':
                return blue[500];
            default:
                return red[500];
        }
    }

    return (
        <Box sx={styles.mainContainer}>
            <Typography variant="overline" fontWeight="bold">Status por Requerimiento</Typography>
            <Box sx={styles.contentContainer}>
                {stats && (<Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Roboto', textAlign: 'center' }}>{total} Requerimientos totales</Typography>)}
                <Box sx={{ display: "flex", flexFlow: "row wrap" }}>

                    {stats && stats.map((s, i) => (
                        <Box key={i} sx={{ mr: 2, mb: 2, width: 80, heigth: 80 }}>

                            <CircularProgressbarWithChildren value={Math.round(((total===0) ? 0 : (s.cantidad / total)) * 100)} styles={{
                                path: {
                                    // Path color
                                    stroke: `${getColorByStatus(s.status)}`,
                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: 'round',
                                    // Customize transition animation
                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                    // Rotate the path
                                    transform: 'rotate(0.25turn)',
                                    transformOrigin: 'center center',
                                },
                            }}>
                                <Typography variant="subtitle2" fontSize={10}>{s.cantidad} {ucfirst(s.status)}</Typography>
                                <Typography fontWeight={'bold'}>{`${Math.round(((total===0) ? 0 : (s.cantidad / total)) * 100)}%`}</Typography>
                            </CircularProgressbarWithChildren>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}