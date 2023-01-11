import { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { baseUrl } from '../../common/baseUrl';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { ucfirst } from '../../lib/functions';
import 'react-circular-progressbar/dist/styles.css';
import { yellow, green, blue, red, orange } from '@mui/material/colors';
interface IResumenReq {
    status: string;
    cantidad: number;
}
export const WidgetResumenTareas: FC = () => {

    const [stats, setStats] = useState<IResumenReq[] | null>(null)
    const [total, setTotal] = useState<number>(0);

    const getStats = async () => {
        const url = `${baseUrl}/resumentareas`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        setStats(data.registros)
        // setTotal(data.registros[0].cantidad + data.registros[1].cantidad + data.registros[2].cantidad)
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
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)'
        },
        contentContainer: {
            p: 1,
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "center",
            alignItems: "center",
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
            case 'pendiente':
                return orange[500];
            case 'completada':
                return green[500]
            case 'en proceso':
                return blue[500];
            default:
                return yellow[500]
        }
    }
    return (
        <Box sx={styles.mainContainer}>
            <Typography variant="overline" fontWeight="bold">Resumen Tareas</Typography>
            <Box sx={styles.contentContainer}>
                {stats && (<Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: 'Roboto', textAlign: 'center' }}>{total} Tareas totales</Typography>)}
                <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                    {stats && stats.map((s, i) => (
                        <Box key={i} sx={{ mr: 2, mb: 2, width: 100, heigth: 100 }}>

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
                                <Typography variant="subtitle2" fontSize={10}>{ucfirst(s.status)}</Typography>
                                <Typography fontWeight={'bold'}>{`${Math.round(((total===0) ? 0 : (s.cantidad / total)) * 100)}%`}</Typography>
                            </CircularProgressbarWithChildren>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box >
    )
}