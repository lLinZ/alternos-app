import { FC, useEffect, useState } from 'react'

import { Box, Grid, Typography, useTheme } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { WidgetRequirement, WidgetList, WidgetListaTareas } from '../components/dashboard'
import { Layout } from '../components/layout'

import { validarToken } from '../lib/functions'
import { User } from '../interfaces/user-type'

export const DashboardPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [widgetsS, setWidgets] = useState();
    const theme = useTheme();
    const router = useNavigate();

    useEffect(() => {
        validarToken(router, setUserLogged, setWidgets);
    }, []);


    return (
        <Layout title="Dashboard" user={userLogged}>
            <Grid container display="flex" flexDirection="row" flexWrap="wrap" alignItems="start" spacing={1} sx={{ mb: 5, p: 2 }}>
                <Grid item xs={12} sm={7} md={8}>
                    <Box sx={{ maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" }, paddingBlock: 2 }}>

                        <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' } }}>
                            <Typography variant="overline" fontWeight="bold">Widgets básicos</Typography>
                            <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
                                <WidgetRequirement userLogged={userLogged} />
                                <WidgetListaTareas />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="overline" fontWeight="bold">Widgets adicionales</Typography>
                        <Box sx={{ maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" } }}>
                            <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                                <WidgetList widgets={widgetsS} />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                    <Typography variant="overline" fontWeight="bold">Información</Typography>
                    <Box sx={{ width: "100%", height: 400, background: "#FFF", borderRadius: 5, mb: 1, overflow: "hidden", }}>
                        <Box sx={{ display: "flex", flexFlow: "column wrap", justifyContent: "center", alignItems: "center", width: "100%", p: 1 }}>
                            <img src="./dashboard-image.jpg" style={{ minWidth: 100, maxWidth: 250, width: "auto" }} />
                            <Typography variant="subtitle1" fontWeight="bold">¡Ponte al día con tus tareas!</Typography>
                            <Typography variant="subtitle2" fontWeight="400" color="text.secondary">Utiliza los widgets para acceder más rapido a diferentes interfaces</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Layout >
    )
}
