import { FC, useEffect, useState } from 'react';

import { Grid, Box, Typography } from '@mui/material';

import { baseUrl } from '../common/baseUrl';

import { Briefing } from '../interfaces/briefing-type';
import { useParams } from 'react-router-dom';

const initialValues: Briefing = {
    id: 0,
    case_id: '',
    user_id: 0,
    user_name: '',
    process_id: 0,
    process_name: '',
    process_owner_id: 0,
    process_owner_name: '',
    nombrecliente: '',
    nombremarca: '',
    personacontacto: '',
    telefonocontacto: '',
    emailcontacto: '',
    negocioempresa: '',
    historiaempresa: '',
    ubicacionservicio: '',
    necesidadquesatisface: '',
    diferenciador: '',
    targetedad: '',
    targetgenero: '',
    targetlugardeorigen: '',
    targetgustos: '',
    targetactitudes: '',
    targetestilodevida: '',
    competidores: '',
    marcapersonaedad: '',
    marcapersonagenero: '',
    marcapersonavestido: '',
    marcapersonacarro: '',
    detallerequerimientotipo: '',
    detallerequerimientoexpresaimagen: '',
    detallerequerimientopreferenciacolor: '',
    detallerequerimientocomopercepcion: '',
    detallerequerimientoadicional: '',
    mediosimpresos: '',
    rrss: '',
    audiovisual: '',
    created_at: new Date("Y-m-d H:i:s")
}
export const FichaClientePage: FC = () => {
    const { id } = useParams();
    const [values, setValues] = useState<Briefing>(initialValues);

    const getData = async () => {
        const url = `${baseUrl}/consultabriefing?case_id=${id}`
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
        getData();
    }, [values])
    return (
        <Box sx={{ width: "80%", m: "20px auto" }}>
            <Box sx={{ mb: "20px" }}>
                <Typography variant="h1" sx={{ fontFamily: "Bebas Neue" }} color="text.secondary">BRIEF</Typography>
                <Typography variant="overline" fontWeight="bold">Diseño de identidad corporativa</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="overline" fontWeight="bold">Datos de comerciales</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Nombre de la empresa</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.nombrecliente}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Nombre de la marca</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.nombremarca}</Typography>
                    </Grid>

                    {/* Datos de contacto */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Datos de contacto</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Persona contacto</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.personacontacto}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Telefono</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.telefonocontacto}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Email</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.emailcontacto}</Typography>
                    </Grid>

                    {/* Desc. Empresa */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Sobre su empresa</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">A que se dedica la compañia o cual es la idea de negocio</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.negocioempresa}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Cual es su historia?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.historiaempresa}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Ubicacion y alcance del producto o servicio</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.ubicacionservicio}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Que necesidades satisface?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.necesidadquesatisface}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Factor diferenciador con respecto a la competencia</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.diferenciador}</Typography>
                    </Grid>

                    {/* Target */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Target</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Edad</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetedad}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Género</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetgenero}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Lugar de origen</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetlugardeorigen}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Gustos</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetgustos}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Actitudes</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetactitudes}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Estilo de vida</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.targetestilodevida}</Typography>
                    </Grid>

                    {/* Benchmarking */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">BENCHMARKING</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Competidores</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.competidores}</Typography>
                    </Grid>

                    {/* Marca */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Si su marca fuera una persona</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Que edad tendría?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.marcapersonaedad}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Sería hombre o mujer?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.marcapersonagenero}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Como vestiría? (Formal, informal, deportivo, casual, elegante, etc)</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.marcapersonavestido}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Que carro utilizaria? (economico, de lujo, familiar, deportivo, todo terreno)</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.marcapersonacarro}</Typography>
                    </Grid>

                    {/* Detalles */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Detalles del requerimiento</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.primary" fontWeight="bold">¿Cual es su requerimiento de marca?</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{values.detallerequerimientotipo}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Que desea que exprese su imagen?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.detallerequerimientoexpresaimagen}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Tiene alguna preferencia de color?</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.detallerequerimientopreferenciacolor}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">¿Como le gustaria que el publico percibiera su marca? (en 3 palabras)</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.detallerequerimientocomopercepcion}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.primary" variant="subtitle2" fontWeight="bold">Comentarios adicionales</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.detallerequerimientoadicional}</Typography>
                    </Grid>

                    {/* Medios impresos */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Medios impresos</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.mediosimpresos}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">RRSS</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.rrss}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Audiovisual</Typography>
                        <Typography color="text.secondary" variant="subtitle2">{values.audiovisual}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
