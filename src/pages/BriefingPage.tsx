import { Grid, Box, TextField, Typography, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { FC } from 'react'
import { Layout } from '../components/layout'

export const BriefingPage: FC = () => {
    return (
        <Box sx={{ width: "80%", m: "20px auto" }}>
            <Box sx={{ mb: "20px" }}>
                <Typography variant="h1" sx={{ fontFamily: "Bebas Neue" }} color="text.secondary">BRIEF</Typography>
                <Typography variant="overline" fontWeight="bold">Diseño de identidad corporativa</Typography>
                <Typography variant="subtitle2" color="text.secondary">La informacion que nos entregará a contrinuacion es absolutamente confidencial. Nos permite conocer mejor sus ideas y necesidades para su marca y acercarnos a una mejor solución.</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="overline" fontWeight="bold">Datos de comerciales</Typography>
                <Grid container spacing={2}>


                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Nombre de la empresa" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Nombre de la marca" color="secondary" />
                    </Grid>

                    {/* Datos de contacto */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Datos de contacto</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Persona contacto" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Telefono" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Email" color="secondary" />
                    </Grid>

                    {/* Desc. Empresa */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Sobre su empresa</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="A que se dedica la compañia o cual es la idea de negocio" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Cual es su historia?" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Ubicacion y alcance del producto o servicio" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Que necesidades satisface?" color="secondary" multiline />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Factor diferenciador con respecto a la competencia" multiline color="secondary" />
                    </Grid>

                    {/* Target */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Target</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Edad" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Género" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Lugar de origen" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Gustos" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Actitudes" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Estilo de vida" color="secondary" />
                    </Grid>

                    {/* Benchmarking */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">BENCHMARKING</Typography>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Indique quienes son los competidores directos de su compañia</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline label="Competidores" color="secondary" />
                    </Grid>

                    {/* Marca */}
                    <Grid item xs={12}>
                        <Typography variant="overline" fontWeight="bold">Si su marca fuera una persona</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Que edad tendría?" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Sería hombre o mujer?" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Como vestiría? (Formal, informal, deportivo, casual, elegante, etc)" color="secondary" multiline />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Que carro utilizaria? (economico, de lujo, familiar, deportivo, todo terreno)" multiline color="secondary" />
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
                                defaultValue="dl"
                            >
                                <FormControlLabel value="dl" control={<Radio color="secondary" />} label="Diseño de logotipo" />
                                <FormControlLabel value="rdl" control={<Radio color="secondary" />} label="Rediseño de logotipo" />
                                <FormControlLabel value="icc" control={<Radio color="secondary" />} label="Identidad corporativa completa" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Que desea que exprese su imagen?" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Tiene alguna preferencia de color?" multiline color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="¿Como le gustaria que el publico percibiera su marca? (en 3 palabras)" color="secondary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Comentarios adicionales" multiline color="secondary" />
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
                                defaultValue="dl"
                            >
                                <FormControlLabel value="dv" control={<Radio color="secondary" />} label="Diseño de valla" />
                                <FormControlLabel value="db" control={<Radio color="secondary" />} label="Diseño de brochure" />
                                <FormControlLabel value="da" control={<Radio color="secondary" />} label="Diseño de afiche" />
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
                                defaultValue="postimg"
                            >
                                <FormControlLabel value="postimg" control={<Radio color="secondary" />} label="Post de Imagen" />
                                <FormControlLabel value="postvid" control={<Radio color="secondary" />} label="Post de video" />
                                <FormControlLabel value="hist" control={<Radio color="secondary" />} label="Historias" />
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
                                defaultValue="postimg"
                            >
                                <FormControlLabel value="postimg" control={<Radio color="secondary" />} label='Videos 15"' />
                                <FormControlLabel value="postvid" control={<Radio color="secondary" />} label='Videos 20"' />
                                <FormControlLabel value="hist" control={<Radio color="secondary" />} label='Videos 30"' />
                                <FormControlLabel value="reel" control={<Radio color="secondary" />} label='Videos 41"' />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
