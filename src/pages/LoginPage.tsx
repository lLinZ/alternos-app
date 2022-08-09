import { FC } from 'react';

import { Button, Grid, TextField, Typography, useTheme } from '@mui/material';

import { Formik, Form, FormikValues } from 'formik';

import { Layout } from '../components/layout';

interface Props {

}
const initialValues = {
    usuario: "",
    password: "",
}

export const LoginPage: FC<Props> = () => {
    const theme = useTheme();
    console.log({ theme })
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
                {({ values, errors, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container display="flex" justifyContent="center" alignItems="center" sx={{ width: { xs: "80%", md: "65%", lg: "50%" }, margin: "20px auto", }}>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <TextField fullWidth onChange={handleChange} label="Usuario" name="usuario" type="text" variant="standard" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <TextField fullWidth onChange={handleChange} label="Contraseña" name="password" type="password" variant="standard" color="secondary" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Button type="submit" fullWidth variant="text" color="secondary" sx={{ p: 2 }}>Iniciar sesion</Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout >
    )
}
