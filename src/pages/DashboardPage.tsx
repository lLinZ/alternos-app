import { FC, useEffect, useState } from 'react'

import { Box, Grid, Typography, useTheme } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { WidgetRequirement, WidgetList, WidgetListaTareas, WidgetSecurity, WidgetInformativo } from '../components/dashboard'
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
                <Grid item xs={12} sm={8} md={9}>
                    <Box sx={{
                        maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" }, paddingBlock: 2, '&::-webkit-scrollbar': {
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

                        <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' } }}>
                            <Typography variant="overline" fontWeight="bold">Widgets básicos</Typography>
                            <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
                                <WidgetRequirement userLogged={userLogged} />
                                <WidgetListaTareas />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" }, paddingBlock: 2, '&::-webkit-scrollbar': {
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
                        <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' } }}>
                            <Typography variant="overline" fontWeight="bold">Widgets adicionales</Typography>
                            <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                                <WidgetList widgets={widgetsS} />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Typography variant="overline" fontWeight="bold">Información</Typography>
                    <WidgetInformativo />
                    <WidgetSecurity />
                </Grid>
            </Grid>
        </Layout >
    )
}
