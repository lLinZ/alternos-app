import { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { baseUrl } from '../../common/baseUrl';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ucfirst } from '../../lib/functions';
import 'react-circular-progressbar/dist/styles.css';
import { yellow, green, blue, red, pink } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
interface IResumenReq {
    status: string;
    cantidad: number;
    avance: number;
}
export const WidgetResumenOfertasVentas: FC = () => {
    const router = useNavigate()

    const [stats, setStats] = useState<IResumenReq[] | null>(null)
    const [total, setTotal] = useState<number>(0);


    const getStats = async () => {
        const url = `${baseUrl}/resumenofertasventas`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        setStats(data.registros)
        // setTotal(data.registros[0].cantidad + data.registros[1].cantidad + data.registros[2].cantidad + data.registros[3].cantidad + data.registros[4].cantidad)
        let xCant = 0;
        data.registros.map((elemento:any) => {
            xCant += elemento.cantidad 
        });
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
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
            cursor: 'pointer'
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
            case 'confirmada':
                return blue[500];
            case 'aprobada':
                return green[500]
            case 'enviada':
                return pink[500]
            case 'nueva':
                return yellow[500]
            default:
                return red[500];
        }
    }
    return (
        <Box sx={styles.mainContainer} onClick={() => router("/offer/resume/pending")}>
            <Typography variant="overline" fontWeight="bold">Reporte de Ofertas pendientes</Typography>
            <Box sx={styles.contentContainer}>
                {stats && (<Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Roboto', textAlign: 'center' }}>{total} Ofertas totales</Typography>)}
                <Box sx={{ display: "flex", alignItems: "center", flexFlow: "row wrap", justifyContent: "center" }}>
                    {stats && stats.map((s, i) => (
                        <Box key={i} sx={{ mr: 2, mb: 2, width: 90, heigth: 90 }}>
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
        </Box >
    )
}