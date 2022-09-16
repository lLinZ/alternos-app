import { Grid, Box, TextField, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button } from '@mui/material'
import { Form, Formik, FormikValues } from 'formik'
import { FC } from 'react'
import { baseUrl } from '../common/baseUrl'
import { Briefing } from '../interfaces/briefing-type'

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

    const onSubmit = (values: FormikValues) => {
        const url = `${baseUrl}/briefing`
        const body = new FormData();

        console.log({ values })

        const options = {
            method: "POST",
            body
        }
    }

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
                                            defaultValue="DisenoLogotipo"
                                            value={values.detallerequerimientotipo}
                                            name="detallerequerimientotipo"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="DisenoLogotipo" control={<Radio color="secondary" />} label="Diseño de logotipo" />
                                            <FormControlLabel value="RedisenoLogotipo" control={<Radio color="secondary" />} label="Rediseño de logotipo" />
                                            <FormControlLabel value="IdentidadCorporativa" control={<Radio color="secondary" />} label="Identidad corporativa completa" />
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
                                            defaultValue="PostImagen"
                                            value={values.rrss}
                                            name="rrss"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="PostImagen" control={<Radio color="secondary" />} label="Post de Imagen" />
                                            <FormControlLabel value="PostVideo" control={<Radio color="secondary" />} label="Post de video" />
                                            <FormControlLabel value="Historias" control={<Radio color="secondary" />} label="Historias" />
                                            <FormControlLabel value="Reel" control={<Radio color="secondary" />} label="Reel" />
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
                                            defaultValue="Videos15"
                                            value={values.audiovisual}
                                            name="audiovisual"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value="Videos15" control={<Radio color="secondary" />} label='Videos 15"' />
                                            <FormControlLabel value="Videos20" control={<Radio color="secondary" />} label='Videos 20"' />
                                            <FormControlLabel value="Videos30" control={<Radio color="secondary" />} label='Videos 30"' />
                                            <FormControlLabel value="Videos41" control={<Radio color="secondary" />} label='Videos 41"' />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" color="secondary" variant="contained" >Enviar</Button>
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
