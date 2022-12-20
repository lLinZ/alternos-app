import { FC, useEffect, useState } from 'react';

import { Grid, Box, Typography } from '@mui/material';

import { baseUrl } from '../common/baseUrl';

import { Briefing } from '../interfaces/briefing-type';
import { useParams } from 'react-router-dom';
interface FichaCliente {
    id: number;
    name: string;
    username: string;
    phone: string;
    cedularif: string;
    direccionfiscal: string;
    function_name: string;
    contacto: string;
    descripcion: string;
    cuentacontable: string;
}
const initialValues: FichaCliente = {
    id: 0,
    name: "",
    username: "",
    function_name: "",
    phone: "",
    cedularif: "",
    direccionfiscal: "",
    contacto: "",
    descripcion: "",
    cuentacontable: "",
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
                <Typography variant="overline" fontWeight="bold">Informacion</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Nombre</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Departamento</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.function_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Cedula / RIF</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.cedularif}</Typography>
                    </Grid>

                    {/* Datos de contacto */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Datos de contacto</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Contacto</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.contacto}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Telefono</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.phone}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Email</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.username ? values.username : 'No posee'}</Typography>
                    </Grid>

                    {/* Desc. Empresa */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Informacion</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Direccion Fiscal</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.direccionfiscal ? values.direccionfiscal : 'No posee'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Cuenta contable</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.cuentacontable ? values.cuentacontable : 'No posee'}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
