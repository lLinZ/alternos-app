import { Grid, Box, TextField, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button } from '@mui/material'
import { Form, Formik, FormikValues } from 'formik'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { Briefing } from '../interfaces/briefing-type'
import { User } from '../interfaces/user-type'
import { validarToken } from '../lib/functions'

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
export const BriefingPage: FC = () => {

    // Parametros GET
    const { processId, caseId } = useParams();

    // Usuario logeado
    const [userLogged, setUserLogged] = useState<User | null>(null)

    // Router
    const router = useNavigate();

    /**
     * Funcion para enviar los datos del brief a la API
     * @param values Valores del Formik
     */
    const onSubmit = async (values: FormikValues) => {
        if (!userLogged) router("/");

        const url = `${baseUrl}/briefing`

        const body = new FormData();
        body.append("user_id", String(userLogged?.id));
        body.append("process_id", String(processId));
        body.append("case_id", String(caseId));
        body.append("nombrecliente", values.nombrecliente);
        body.append("nombremarca", values.nombremarca);
        body.append("personacontacto", values.personacontacto);
        body.append("telefonocontacto", values.telefonocontacto);
        body.append("emailcontacto", values.emailcontacto);
        body.append("negocioempresa", values.negocioempresa);
        body.append("historiaempresa", values.historiaempresa);
        body.append("ubicacionservicio", values.ubicacionservicio);
        body.append("necesidadquesatisface", values.necesidadquesatisface);
        body.append("diferenciador", values.diferenciador);
        body.append("targetedad", values.targetedad);
        body.append("targetgenero", values.targetgenero);
        body.append("targetlugardeorigen", values.targetlugardeorigen);
        body.append("targetgustos", values.targetgustos);
        body.append("targetactitudes", values.targetactitudes);
        body.append("targetestilodevida", values.targetestilodevida);
        body.append("competidores", values.competidores);
        body.append("marcapersonaedad", values.marcapersonaedad);
        body.append("marcapersonagenero", values.marcapersonagenero);
        body.append("marcapersonavestido", values.marcapersonavestido);
        body.append("marcapersonacarro", values.marcapersonacarro);
        body.append("detallerequerimientotipo", values.detallerequerimientotipo);
        body.append("detallerequerimientoexpresaimagen", values.detallerequerimientoexpresaimagen);
        body.append("detallerequerimientopreferenciacolor", values.detallerequerimientopreferenciacolor);
        body.append("detallerequerimientocomopercepcion", values.detallerequerimientocomopercepcion);
        body.append("detallerequerimientoadicional", values.detallerequerimientoadicional);
        body.append("mediosimpresos", values.mediosimpresos);
        body.append("rrss", values.rrss);
        body.append("audiovisual", values.audiovisual);

        console.log({ body })
        const options = {
            method: "POST",
            body
        }
        const respuesta = await fetch(url, options);

        const data = await respuesta.json();
        if (data.exito === "SI") {
            Swal.fire({
                title: "Exito",
                text: data.mensaje,
                icon: "success",
            }).then(click => {
                router("/dashboard");
            })
        } else {
            Swal.fire({
                title: "Error",
                text: data.mensaje,
                icon: "error",
            })
        }
    }

    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged)
    }, [])

    // Render()
    return (
        <Box sx={{ width: "80%", m: "20px auto" }}>
            <Box sx={{ mb: "20px" }}>
                <Typography variant="h1" sx={{ fontFamily: "Bebas Neue" }} color="text.secondary">BRIEF</Typography>
                <Typography variant="overline" fontWeight="bold">Diseño de identidad corporativa</Typography>
                <Typography variant="subtitle2" color="text.secondary">La informacion que nos entregará a contrinuacion es absolutamente confidencial. Nos permite conocer mejor sus ideas y necesidades para su marca y acercarnos a una mejor solución.</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="overline" fontWeight="bold">Datos de comerciales</Typography>


                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {({ values, handleChange, handleSubmit, isSubmitting }) => (



                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>


                                <Grid item xs={12} sm={6}>
                                    <TextField name="nombrecliente" value={values.nombrecliente} onChange={handleChange} fullWidth label="Nombre de la empresa" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="nombremarca" value={values.nombremarca} onChange={handleChange} fullWidth label="Nombre de la marca" color="secondary" />
                                </Grid>

                                {/* Datos de contacto */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Datos de contacto</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="personacontacto" value={values.personacontacto} onChange={handleChange} fullWidth label="Persona contacto" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="telefonocontacto" value={values.telefonocontacto} onChange={handleChange} fullWidth label="Telefono" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="emailcontacto" value={values.emailcontacto} onChange={handleChange} fullWidth label="Email" color="secondary" />
                                </Grid>

                                {/* Desc. Empresa */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Sobre su empresa</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField name="negocioempresa" value={values.negocioempresa} onChange={handleChange} fullWidth multiline label="A que se dedica la compañia o cual es la idea de negocio" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="historiaempresa" value={values.historiaempresa} onChange={handleChange} fullWidth label="¿Cual es su historia?" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="ubicacionservicio" value={values.ubicacionservicio} onChange={handleChange} fullWidth label="Ubicacion y alcance del producto o servicio" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="necesidadquesatisface" value={values.necesidadquesatisface} onChange={handleChange} fullWidth label="¿Que necesidades satisface?" color="secondary" multiline />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="diferenciador" value={values.diferenciador} onChange={handleChange} fullWidth label="Factor diferenciador con respecto a la competencia" multiline color="secondary" />
                                </Grid>

                                {/* Target */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Target</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetedad" value={values.targetedad} onChange={handleChange} fullWidth label="Edad" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetgenero" value={values.targetgenero} onChange={handleChange} fullWidth label="Género" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetlugardeorigen" value={values.targetlugardeorigen} onChange={handleChange} fullWidth label="Lugar de origen" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetgustos" value={values.targetgustos} onChange={handleChange} fullWidth label="Gustos" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetactitudes" value={values.targetactitudes} onChange={handleChange} fullWidth label="Actitudes" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="targetestilodevida" value={values.targetestilodevida} onChange={handleChange} fullWidth label="Estilo de vida" color="secondary" />
                                </Grid>

                                {/* Benchmarking */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">BENCHMARKING</Typography>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Indique quienes son los competidores directos de su compañia</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField name="competidores" value={values.competidores} onChange={handleChange} fullWidth multiline label="Competidores" color="secondary" />
                                </Grid>

                                {/* Marca */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Si su marca fuera una persona</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="marcapersonaedad" value={values.marcapersonaedad} onChange={handleChange} fullWidth label="¿Que edad tendría?" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="marcapersonagenero" value={values.marcapersonagenero} onChange={handleChange} fullWidth label="¿Sería hombre o mujer?" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="marcapersonavestido" value={values.marcapersonavestido} onChange={handleChange} fullWidth label="¿Como vestiría? (Formal, informal, deportivo, casual, elegante, etc)" color="secondary" multiline />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="marcapersonacarro" value={values.marcapersonacarro} onChange={handleChange} fullWidth label="¿Que carro utilizaria? (economico, de lujo, familiar, deportivo, todo terreno)" multiline color="secondary" />
                                </Grid>

                                {/* Detalles */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Detalles del requerimiento</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">¿Cual es su requerimiento de marca?</Typography>
                                    <FormControl>
                                        <RadioGroup
                                            color="secondary"
                                            row
                                            defaultValue="logotipo"
                                            value={values.detallerequerimientotipo}
                                            name="detallerequerimientotipo"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="logotipo" control={<Radio color="secondary" />} label="Diseño de logotipo" />
                                            <FormControlLabel value="rediseño" control={<Radio color="secondary" />} label="Rediseño de logotipo" />
                                            <FormControlLabel value="identidad" control={<Radio color="secondary" />} label="Identidad corporativa completa" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="detallerequerimientoexpresaimagen" value={values.detallerequerimientoexpresaimagen} onChange={handleChange} fullWidth label="¿Que desea que exprese su imagen?" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="detallerequerimientopreferenciacolor" value={values.detallerequerimientopreferenciacolor} onChange={handleChange} fullWidth label="¿Tiene alguna preferencia de color?" multiline color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="detallerequerimientocomopercepcion" value={values.detallerequerimientocomopercepcion} onChange={handleChange} fullWidth label="¿Como le gustaria que el publico percibiera su marca? (en 3 palabras)" color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="detallerequerimientoadicional" value={values.detallerequerimientoadicional} onChange={handleChange} fullWidth label="Comentarios adicionales" multiline color="secondary" />
                                </Grid>

                                {/* Medios impresos */}
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Medios impresos</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <RadioGroup
                                            color="secondary"
                                            row
                                            defaultValue="DisenoValla"
                                            value={values.mediosimpresos}
                                            name="mediosimpresos"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="DisenoValla" control={<Radio color="secondary" />} label="Diseño de valla" />
                                            <FormControlLabel value="DisenoBochure" control={<Radio color="secondary" />} label="Diseño de brochure" />
                                            <FormControlLabel value="DisenoAfiche" control={<Radio color="secondary" />} label="Diseño de afiche" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">RRSS</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <RadioGroup
                                            color="secondary"
                                            row
                                            defaultValue="imagen"
                                            value={values.rrss}
                                            name="rrss"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="imagen" control={<Radio color="secondary" />} label="Post de Imagen" />
                                            <FormControlLabel value="video" control={<Radio color="secondary" />} label="Post de video" />
                                            <FormControlLabel value="historia" control={<Radio color="secondary" />} label="Historias" />
                                            <FormControlLabel value="reel" control={<Radio color="secondary" />} label="Reel" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="overline" fontWeight="bold">Audiovisual</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl>
                                        <RadioGroup
                                            color="secondary"
                                            row
                                            defaultValue="15"
                                            value={values.audiovisual}
                                            name="audiovisual"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="15" control={<Radio color="secondary" />} label='Videos 15"' />
                                            <FormControlLabel value="20" control={<Radio color="secondary" />} label='Videos 20"' />
                                            <FormControlLabel value="30" control={<Radio color="secondary" />} label='Videos 30"' />
                                            <FormControlLabel value="41" control={<Radio color="secondary" />} label='Videos 41"' />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>Enviar</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )
                    }
                </Formik>
            </Box>
        </Box>
    )
}
