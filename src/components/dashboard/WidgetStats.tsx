import React, { FC, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { User } from '../../interfaces/user-type';
import CheckCircle from '@mui/icons-material/CheckCircleRounded';
import Group from '@mui/icons-material/GroupRounded';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { baseUrl } from '../../common/baseUrl';
import { LinearProgress } from '@mui/material';
import { VictoryPie } from 'victory';

interface Props {
    user: User | null;
}
interface IStat {
    users: { clientes: number, usuarios: number };
    ofertas: { enviadas: number, confirmadas: number, totales: number };
}
export const WidgetStats: FC<Props> = ({ user }) => {

    const [stats, setStats] = useState<IStat | null>(null)


    const getStats = async () => {
        const url = `${baseUrl}/informaciondashboardadmin`
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        setStats(data.registros)
    }
    useEffect(() => {
        getStats();
    }, [])
    const styles = {
        mainContainer: {
            display: user ? user.role_name === 'Administrador' ? "flex" : 'none' : "none",
            borderRadius: 5,
            m: 1,
            p: 2,
            minWidth: { xs: "100%", sm: 450 },
            maxWidth: { xs: "100%", sm: 450 },
            background: "#FFF",
            minHeight: 250,
            maxHeight: 250,
            flexFlow: "column wrap",
            boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)'
        },
        usersTitleIcon: {
            background: 'linear-gradient(150deg, rgba(87,234,255,1) 0%, rgba(17,132,217,1) 100%)',
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            width: 25,
            height: 25,
            borderRadius: 1,
            mr: 0.5,
        },
        titleContainer: {
            display: 'flex',
            justifyContent: "center",
            alignItems: "start",
            flexFlow: "row wrap"
        },
        contentContainer: {
            p: 2,
            display: 'flex',
            flexFlow: "row wrap",
            justifyContent: "space-between"

        },
        statContainer: {
            mb: 1,
            display: "flex",
            flexFlow: "column wrap"
        }
    }
    return (
        <Box sx={styles.mainContainer}>
            <Typography variant="overline" fontWeight="bold">Stats</Typography>
            <Box>
                <Typography color="text.secondary" variant="subtitle2" fontWeight="bold">El {stats && Math.round((((Number(stats.ofertas.enviadas) + Number(stats.ofertas.confirmadas)) / Number(stats.ofertas.totales)) * 100) * 100) / 100}% de las ofertas totales ({stats && stats.ofertas.totales}) han sido confirmadas ({stats && stats.ofertas.confirmadas}) o enviadas ({stats && stats.ofertas.enviadas})</Typography>
                <LinearProgress variant="determinate" color='success' sx={{ background: user ? user.coloravatar : 'secondary' }} value={stats ? (((Number(stats.ofertas.enviadas) + Number(stats.ofertas.confirmadas)) / Number(stats.ofertas.totales)) * 100) : 0} />
            </Box>
            <Box sx={styles.contentContainer}>
                <Box sx={styles.statContainer}>
                    <Box sx={styles.titleContainer}>
                        <Box sx={styles.usersTitleIcon}>
                            <Group sx={{ width: 15, height: 15 }} color="primary" />
                        </Box>
                        <Typography variant={"h6"} fontWeight="bold" color='text.secondary'>{stats && stats.users.clientes ? stats.users.clientes : 'Cargando...'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexFlow: "row wrap", alignItems: "end", mt: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color='text.secondary' sx={{ fontSize: 12 }}>Clientes</Typography>
                    </Box>
                </Box>
                <Box sx={styles.statContainer}>
                    <Box sx={styles.titleContainer}>
                        <Box sx={{ ...styles.usersTitleIcon, background: "linear-gradient(150deg, rgba(255,233,87,1) 0%, rgba(217,117,17,1) 100%)" }}>
                            <Group sx={{ width: 15, height: 15 }} color="primary" />
                        </Box>
                        <Typography variant={"h6"} fontWeight="bold" color='text.secondary'>{stats && stats.users.usuarios ? stats.users.usuarios : 'Cargando...'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexFlow: "row wrap", alignItems: "end", mt: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color='text.secondary' sx={{ fontSize: 12 }}>Usuarios</Typography>
                    </Box>
                </Box>
                <Box sx={styles.statContainer}>
                    <Box sx={styles.titleContainer}>
                        <Box sx={{ ...styles.usersTitleIcon, background: "linear-gradient(150deg, rgba(255,87,169,1) 0%, rgba(174,17,217,1) 100%)" }}>
                            <RequestPageIcon sx={{ width: 15, height: 15 }} color="primary" />
                        </Box>
                        <Typography variant={"h6"} fontWeight="bold" color='text.secondary'>{stats && stats.ofertas.enviadas ? stats.ofertas.enviadas : 'Cargando...'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexFlow: "row wrap", alignItems: "end", mt: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color='text.secondary' sx={{ fontSize: 12 }}>Ofertas env.</Typography>
                    </Box>
                </Box>
                <Box sx={styles.statContainer}>
                    <Box sx={styles.titleContainer}>
                        <Box sx={{ ...styles.usersTitleIcon, background: "linear-gradient(150deg, rgba(189,255,87,1) 0%, rgba(17,217,27,1) 100%)" }}>
                            <CheckCircle sx={{ width: 15, height: 15 }} color="primary" />
                        </Box>
                        <Typography variant={"h6"} fontWeight="bold" color='text.secondary'>{stats && stats.ofertas.confirmadas ? stats.ofertas.confirmadas : 'Cargando...'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexFlow: "row wrap", alignItems: "end", mt: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color='text.secondary' sx={{ fontSize: 12 }}>Ofertas conf.</Typography>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}