import { FC } from 'react';

import { Button, Grid, TextField, Typography } from '@mui/material';

import { Formik, Form, FormikValues } from 'formik';

import { Layout } from '../components/layout';

interface Props {

}
const initialValues = {
    name: "",
    password: "",
    phone: "",
    username: "",
}

export const RegisterPage: FC<Props> = () => {

    const onSubmit = async (values: FormikValues) => {
        console.log(values)
        if (!values) {
            return false;
        }

        const url = "https://oficina.alternosgroup.com/api/login";

        const body = new FormData();

        body.append("username", values.usuario);
        body.append("password", values.password);

        const options = {
            method: "POST",
            body
        }

        const respuesta = await fetch(url, options);
        const data = await respuesta.json();
        console.log({ data });
    }

    return (
        <Layout footer={false}>
            <Formik
                initialValues={initialValues}
                onSubmit={(values: FormikValues) => onSubmit(values)}
            >
                {({ values, handleSubmit, handleChange, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField fullWidth onChange={handleChange} variant="standard" label="Nombre y apellido" name="name" type="text" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField fullWidth onChange={handleChange} variant="standard" label="Usuario" name="username" type="text" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField fullWidth onChange={handleChange} variant="standard" label="Teléfono" name="phone" type="text" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField fullWidth onChange={handleChange} variant="standard" label="Contraseña" name="password" type="password" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <TextField fullWidth onChange={handleChange} variant="standard" label="Confirmar contraseña" name="confirmPassword" type="password" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Button type="submit" fullWidth variant="text" color="secondary" sx={{ p: 2 }}>Registrarse</Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}
