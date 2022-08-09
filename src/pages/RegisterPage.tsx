import { FC } from 'react';

import { Button, Grid, TextField, Typography } from '@mui/material';

import { Formik, Form, FormikValues } from 'formik';

import { Layout } from '../components/layout';

interface Props {

}
const initialValues = {
    usuario: "",
    password: "",
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
                {({ values, errors, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth onChange={handleChange} label="Usuario" name="usuario" type="text" color="secondary" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth onChange={handleChange} label="Contraseña" name="password" type="password" color="secondary" />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="secondary">Iniciar sesion</Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}
