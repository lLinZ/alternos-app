import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'

import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { WidgetRequirement, WidgetList, WidgetStats, WidgetListaTareas, WidgetSecurity, WidgetInformativo, WidgetPago, WidgetEstadoDeCuenta, WidgetBrandcenter } from '../components/dashboard'
import { Layout } from '../components/layout'

import { validarToken } from '../lib/functions'
import { User } from '../interfaces/user-type'
import ChevronRightRounded from '@mui/icons-material/ArrowForwardRounded'
import ChevronLeftRounded from '@mui/icons-material/ArrowBackRounded'

export const DashboardPage: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [widgetsS, setWidgets] = useState();
    const theme = useTheme();
    const router = useNavigate();
    const ref = useRef(null);
    const refList = useRef(null);
    useEffect(() => {
        validarToken(router, setUserLogged, setWidgets);
    }, []);

    /**
     * Funcion para hacer scroll a la izquierda de la barra de localidad
     * @param ref Referencia del elemento a scrollear
     */
    const handleScrollLeft = (ref: MutableRefObject<HTMLElement>) => {
        if (!ref.current) {
            return false;
        } else {
            const scrollLeft = Number(ref.current.scrollLeft);
            const newScroll = scrollLeft - 100;
            const scrollOptions: ScrollToOptions = {
                top: 0,
                left: newScroll,
                behavior: 'smooth'
            };
            ref.current.scroll(scrollOptions)

        }
    }
    /**
     * Funcion para hacer scroll a la derecha de la barra de localidad
     * @param ref Referencia del elemento a scrollear
     */
    const handleScrollRight = (ref: MutableRefObject<HTMLElement>) => {
        if (!ref.current) {
            return false;
        } else {
            const scrollLeft = Number(ref.current.scrollLeft);
            const newScroll = scrollLeft + 100;
            const scrollOptions: ScrollToOptions = {
                top: 0,
                left: newScroll,
                behavior: 'smooth'
            };
            ref.current.scroll(scrollOptions)
        }
    }
    return (
        <Layout title="Dashboard" user={userLogged}>
            <Box sx={{ minHeight: "100vh", width: "100%", display: "flex", flexFlow: "column wrap", alignItems: "flex-start" }}>
                <WidgetSecurity />
                <Grid container display="flex" flexDirection="row" flexWrap="wrap" alignItems="start" spacing={1} sx={{ mb: 5, p: 1 }}>
                    <Grid item xs={12} sx={{ position: "relative", }}>
                        <Typography variant="overline" fontWeight="bold">Widgets básicos</Typography>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
                            {
                                // Administrador
                                userLogged && userLogged.role_id === 1 && (
                                    <>
                                        <WidgetStats user={userLogged} />
                                        <WidgetRequirement userLogged={userLogged} />
                                        <WidgetEstadoDeCuenta user={userLogged} />
                                        <WidgetListaTareas />
                                        <WidgetPago userLogged={userLogged} />
                                        <WidgetBrandcenter />
                                    </>
                                )
                            }
                            {
                                // Rol Usuario
                                userLogged && userLogged.role_id === 2 && (
                                    <>
                                        <WidgetListaTareas />
                                    </>
                                )
                            }
                            {
                                // Rol Cliente
                                userLogged && userLogged.role_id === 3 && (
                                    <>
                                        <WidgetEstadoDeCuenta user={userLogged} />
                                        <WidgetPago userLogged={userLogged} />
                                        <WidgetBrandcenter />
                                    </>
                                )
                            }
                            {
                                // Rol Comercial
                                userLogged && userLogged.role_id === 4 && (
                                    <>
                                        <WidgetRequirement userLogged={userLogged} />
                                        <WidgetListaTareas />
                                        <WidgetPago userLogged={userLogged} />
                                    </>
                                )
                            }
                            {
                                // Rol Tráfico
                                userLogged && userLogged.role_id === 5 && (
                                    <>
                                        <WidgetRequirement userLogged={userLogged} />
                                        <WidgetListaTareas />
                                    </>
                                )
                            }
                            {
                                // Rol Invitado
                                userLogged && userLogged.role_id === 99 && (
                                    <>
                                    </>
                                )

                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ position: "relative", }}>
                        <Typography variant="overline" fontWeight="bold">Widgets adicionales</Typography>
                        <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "center" }}>
                            <WidgetList widgets={widgetsS} />
                            <WidgetInformativo />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Layout >
    )
}
