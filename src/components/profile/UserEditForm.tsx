import { Dispatch, FC, SetStateAction } from 'react'
import { Box, Grid, Typography, TextField, Button } from '@mui/material';
import { FormikValues, FormikState, Formik, Form } from 'formik';
import Swal from 'sweetalert2';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
interface Props {
    initialValues: NewUser;
    setUserLogged: Dispatch<SetStateAction<User | null>>;
    userLogged: User | null
}
export interface NewUser {
    name: string;
    phone: string;
    username: string;
    password: string;
    confirmPassword: string;
}
export const UserEditForm: FC<Props> = ({ initialValues, setUserLogged, userLogged }) => {
    /**
 * Funcion para enviar los datos a la API para editar informacion de usuario
 * @param values Datos del form
 * @param resetForm Funcion para reiniciar el formulario luego de enviar exitosamente los datos
 * @returns false si ocurre alguna novedad
 */
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<NewUser>> | undefined) => void) => {

        if (values.password !== values.confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
            });
            return false;
        }
        const url = `${baseUrl}/perfil`;

        const body = new FormData();


        body.append("username", String(userLogged?.username));
        values.name && body.append("name", String(values.name));
        values.phone && body.append("phone", String(values.phone));
        values.password && body.append("password", String(values.password));

        const newUserData = {
            ...userLogged,
            name: values.name ? values.name : userLogged?.name,
            phone: values.phone ? values.phone : userLogged?.phone,
            password: values.password ? values.password : userLogged?.password,
            username: values.username ? values.username : userLogged?.username,
        }
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                Swal.fire({
                    title: "Exito",
                    text: "Se han editado los datos exitosamente",
                    icon: "success",
                });
                setUserLogged(newUserData as User)
                resetForm();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró enviar los datos",
                    icon: "error",
                });

            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "No se logró contectar al servidor",
                icon: "error",
            });
        }
    }

    return (
        <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: { xs: "center", sm: "space-evenly", md: "space-between" }, mt: 2 }}>

            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                validateOnMount={false}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({ handleChange, handleSubmit, values, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="overline" fontWeight="bold">Editar información de usuario</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="name" color="secondary" onChange={handleChange} sx={{ "& fieldset": { border: "none" }, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Nombre" fullWidth value={values.name} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="phone" color="secondary" onChange={handleChange} sx={{ "& fieldset": { border: "none" }, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Teléfono" fullWidth value={values.phone} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="password" color="secondary" onChange={handleChange} sx={{ "& fieldset": { border: "none" }, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Contraseña" fullWidth value={values.password} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="confirmPassword" color="secondary" onChange={handleChange} sx={{ "& fieldset": { border: "none" }, background: "#FFF", boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)", borderRadius: 5 }} InputProps={{ sx: { borderRadius: 5 } }} label="Confirmar contraseña" fullWidth value={values.confirmPassword} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button disabled={isSubmitting} type="submit" fullWidth disableElevation variant="contained" color="secondary" sx={{ p: 2, borderRadius: 5, textTransform: "none" }}>Editar información</Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}
