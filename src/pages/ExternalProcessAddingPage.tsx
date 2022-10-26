import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout'
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form, FormikValues, FormikState } from 'formik';
import { baseUrl } from '../common/baseUrl';
import Swal from 'sweetalert2';

const initialValues = {
    id: 'new',
    name: '',
    costo: '',
    precio: '',
    centrodecosto1: '',
    centrodecosto2: '',
    owner_name: '',
}

export const ExternalProcessAddingPage: FC = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useNavigate()

    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void) => {
        setIsSubmitting(true);

        // Array de errores
        let errores = [];

        // Validaciones
        if (values.name === '') {
            errores.push('El campo nombre es obligatorio');
        }
        if (values.owner_name === '') {
            errores.push('El nombre del propietario es obligatorio');
        }
        if (values.centrodecosto1 === '') {
            errores.push('Debe introducir un centro de costo');
        }
        if (values.centrodecosto2 === '') {
            errores.push('Debe introducir un centro de costo secundario');
        }

        // Se verifica que no existan errores
        if (errores.length === 0) {

            // URL de la API
            const url = `${baseUrl}/procesosexternos`;

            // Cuerpo de la solicitud HTTPS
            const body = new FormData();
            body.append('id', String(values.id))
            body.append('name', String(values.name))
            body.append('onwer_name', String(values.onwer_name))
            body.append('costo', String(values.costo))
            body.append('precio', String(values.precio))
            body.append('centrodecosto1', String(values.centrodecosto1))
            body.append('centrodecosto2', String(values.centrodecosto2))

            // Options de la solicitud HTTPS
            const options = {
                method: 'POST',
                body
            }
            try {
                // Solicitud a la API
                const respuesta = await fetch(url, options)
                switch (respuesta.status) {
                    case 200:
                        const data = await respuesta.json()
                        if (data.exito === "SI") {
                            Swal.fire({
                                title: "Exito",
                                text: "Se ha registrado el proceso",
                                icon: "error",
                            })
                            resetForm();
                            setIsSubmitting(false);
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: data.mensaje,
                                icon: "error",
                            })
                        }
                        setIsSubmitting(false);

                        break;
                    default:
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrio un error al conectar con el servidor",
                            icon: "error",
                        })
                        setIsSubmitting(false);

                        break;
                }
            } catch (err) {
                console.log(err)
                Swal.fire({
                    title: "Error",
                    text: "Ocurrio un error al conectar con el servidor",
                    icon: "error",
                })
                setIsSubmitting(false);

            }
        } else {
            let errorString = '';
            errores.map((e: string) => errorString += `<p>- ${e}</p>`)
            Swal.fire({
                title: "Error",
                html: errorString,
                icon: "error",
            })
            setIsSubmitting(false);

        }
    }

    return (
        <Layout user={userLogged}>
            <Box sx={styles.mainContainer}>
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Registrar un proceso externo</Typography>

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values: FormikValues, { resetForm }) => onSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleSubmit }) => (

                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={1} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Nombre" name="name" sx={styles.input} value={values.name} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Nombre del propietario" sx={styles.input} name="owner_name" value={values.owner_name} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Costo" name="costo" sx={styles.input} value={values.costo} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Precio" name="precio" sx={styles.input} value={values.precio} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Centro de costo 1" sx={styles.input} name="centrodecosto1" value={values.centrodecosto1} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Centro de costo 2" sx={styles.input} name="centrodecosto2" value={values.centrodecosto2} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton type='submit' disabled={isSubmitting} loading={isSubmitting} color="secondary" variant="contained" fullWidth sx={styles.button}>Registrar</LoadingButton>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Layout>
    )
}
const styles = {
    mainContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh"
    },
    button: {
        p: 1.9,
        borderRadius: 5,
        textTransform: "none",
    },
    input: {
        "& fieldset": {
            border: "none",
        },
        "& input": {
            borderRadius: 5,
            background: "#FFF",
            boxShadow: "0 0 5px rgba(100,100,100,0.1)"
        }
    }
}