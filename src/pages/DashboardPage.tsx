import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'

import { Box, Grid, IconButton, Typography, useTheme } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { WidgetRequirement, WidgetList, WidgetListaTareas, WidgetSecurity, WidgetInformativo, WidgetPago } from '../components/dashboard'
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
                        <IconButton onClick={() => handleScrollLeft(ref as unknown as MutableRefObject<HTMLElement>)} sx={{ position: "absolute", top: 35, left: 0 }}>
                            <ChevronLeftRounded />
                        </IconButton>
                        <IconButton onClick={() => handleScrollRight(ref as unknown as MutableRefObject<HTMLElement>)} sx={{ position: "absolute", top: 35, right: 0 }}>
                            <ChevronRightRounded />
                        </IconButton>
                        <Box ref={ref} sx={{

                            maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" },
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

                        }}>

                            <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' }, }}>
                                <Typography variant="overline" fontWeight="bold">Widgets básicos</Typography>
                                <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
                                    <WidgetRequirement userLogged={userLogged} />
                                    <WidgetListaTareas />
                                    <WidgetPago userLogged={userLogged} />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            maxWidth: { xs: "100vw", md: "100%" }, overflowX: { xs: "auto", md: "scroll" },
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
                            <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' } }}>
                                <Typography variant="overline" fontWeight="bold">Widgets adicionales</Typography>
                                <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
                                    <WidgetList widgets={widgetsS} />
                                    <WidgetInformativo />
                                </Box>
                            </Box>
                        </Box>
                        {/* <Box sx={{ display: { xs: "flex", md: "inline-block" }, flexFlow: { xs: "column nowrap", md: 'none' } }}>
                        <Typography variant="overline" fontWeight="bold">Información</Typography>
                    </Box> */}
                    </Grid>
                </Grid>
            </Box>
        </Layout >
    )
}
