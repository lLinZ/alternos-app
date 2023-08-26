import { FC, useEffect, useState, ChangeEvent } from 'react';

import { Box, Grid, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

import { Layout } from '../components/layout';
import { validarToken } from '../lib/functions';
import { baseUrl } from '../common/baseUrl';

import { User } from '../interfaces/user-type';

interface Props {

}
export const DepartmentAddingPage: FC<Props> = () => {

    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [name, setName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const router = useNavigate();
    const onSubmit = async () => {
        setIsSubmitting(true);
        if (!name) {
            Swal.fire({
                title: "Error",
                text: "El campo nombre está vacio",
                icon: "error",
            });
            return;
        }
        const url = `${baseUrl}/registrafunctions`;

        const body = new FormData();

        body.append("name", String(name));
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                Swal.fire({
                    title: "Exito",
                    text: "Departamento creado",
                    icon: "success",
                })
                setName('');
                setIsSubmitting(false);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error",
                })
                setIsSubmitting(false);
            }

        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error",
            })
            setIsSubmitting(false);
        }

    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [])

    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography component="h2" fontWeight="bold" variant="overline" fontSize={16}>Registrar un departamento</Typography>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} >
                        <TextField fullWidth color="secondary" label="Nombre del departamento" name="name" value={name} onChange={handleChange} multiline />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton loading={isSubmitting} color="secondary" variant="contained" fullWidth onClick={onSubmit} sx={{ p: 1.9 }}>Registrar</LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
