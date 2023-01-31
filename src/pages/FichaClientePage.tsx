import { FC, useEffect, useState } from 'react';

import { Grid, Box, Typography } from '@mui/material';

import { baseUrl } from '../common/baseUrl';

import { Briefing } from '../interfaces/briefing-type';
import { useParams } from 'react-router-dom';
interface FichaCliente {
    id: number;
    brand: string;
    name: string;
    username: string;
    phone: string;
    cedularif: string;
    direccionfiscal: string;
    function_name: string;
    contacto: string;
    descripcion: string;
    cuentacontable: string;
    tipodecontribuyente: string,
    ciudad: string,
    codigopostal: string,
    estado: string,
    redessociales: string,
    web: string,
    docrif: string,
    doccedula: string,
    docregistro: string,
    manualdemarca: string
}
const initialValues: FichaCliente = {
    id: 0,
    brand: "",
    name: "",
    username: "",
    function_name: "",
    phone: "",
    cedularif: "",
    direccionfiscal: "",
    contacto: "",
    descripcion: "",
    cuentacontable: "",
    tipodecontribuyente: "",
    ciudad: "",
    codigopostal: "",
    estado: "",
    redessociales: "",
    web: "",
    docrif: "",
    doccedula: "",
    docregistro: "",
    manualdemarca: ""
}
export const FichaClientePage: FC = () => {
    const { id } = useParams();
    const [values, setValues] = useState<FichaCliente>(initialValues);

    const getData = async () => {
        const url = `${baseUrl}/fichacliente?customer_id=${id}`
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                setValues(data.registros[0])
            }
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        if (values.id === 0) {
            getData();
        }
    }, [values])
    return (
        <Box sx={{ width: "80%", m: "20px auto" }}>
            <Box sx={{ mb: "20px" }}>
                <Typography variant="h1" sx={{ fontFamily: "Bebas Neue" }} color="text.secondary">CLIENTE</Typography>
                <Typography variant="overline" fontWeight="bold">Ficha del cliente</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="overline" fontWeight="bold" fontSize="110%">Informacion del negocio</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Marca</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.brand}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Nombre o razón social</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Descripción del negocio o actividad</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.descripcion}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2"><a href={values.manualdemarca}>Manual de marca</a></Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{mt: "20px"}}>
                <Grid container spacing={2}>
                    {/* Datos de contacto */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold" fontSize="110%">Datos de contacto</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Nombre de Contacto</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.contacto}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Telefono</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.phone}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Email</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.username ? values.username : 'No posee'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Redes sociales</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.redessociales}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Página web</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.web ? values.web : 'No posee'}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{mt: "20px"}}>
                <Grid container spacing={2}>
                    {/* Desc. Empresa */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold" fontSize="110%">Informacion de facturación</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Cedula / RIF</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.cedularif}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Direccion Fiscal</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.direccionfiscal ? values.direccionfiscal : 'No posee'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Ciudad</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.ciudad}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Código Postal</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.codigopostal}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Estado</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.estado}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Tipo de contribuyente</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.tipodecontribuyente}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{mt: "20px"}}>
                <Grid container spacing={2}>
                    {/* Desc. Empresa */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold" fontSize="110%">Documentos</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2"><a href={values.docrif}>R.I.F.</a></Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2"><a href={values.doccedula}>Cédula de Identidad</a></Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography color="text.primary" variant="subtitle2"><a href={values.docregistro}>Registro Mercantil</a></Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
