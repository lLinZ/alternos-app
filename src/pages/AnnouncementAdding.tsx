import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Form, Formik, FormikState, FormikValues } from 'formik';
import React, { FC, ChangeEvent, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';
import { validarToken } from '../lib/functions';
import { baseUrl } from '../common/baseUrl';
import moment, { Moment } from 'moment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import DialogActions from '@mui/material/DialogActions';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { PageTitle } from '../components/ui';


const initialValues = {
    texto: '',
}
const MyActionBar = ({
    onAccept,
    onCancel,
}: PickersActionBarProps) => {

    return (
        <DialogActions>
            <Button sx={{ textTransform: "none" }} onClick={onCancel} color="error"> Cancelar </Button>
            <Button sx={{ textTransform: "none" }} onClick={onAccept} color="secondary"> Seleccionar </Button>
        </DialogActions>
    );
};
export const AnnouncementAdding: FC = () => {
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const ref = useRef<HTMLInputElement>(null)
    const [to, setTo] = useState<string>(moment().format("YYYY-MM-DD"))
    const [fechaTo, setFechaTo] = useState<Moment | null>(
        moment()
    );
    const router = useNavigate();
    useEffect(() => {
        validarToken(router, setUserLogged);
    }, [userLogged])
    const handleChangeFechaTo = (newValue: Moment | null) => {
        setFechaTo(newValue);
        setTo(moment(newValue).format("YYYY-MM-DD"));
    };
    moment.locale('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    })
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<{ texto: string; }>> | undefined) => void) => {
        const url = `${baseUrl}/registraanuncio`;

        const body = new FormData();
        body.append('texto', values.texto);
        body.append('status', 'activo');
        body.append('desde', moment().format("YYYY-MM-DD"));
        body.append('hasta', to ? to : moment().format("YYYY-MM-DD"));
        body.append('file', selectedFile ? selectedFile : '');
        const options = {
            method: "POST",
            body,
        }
        try {
            const respuesta = await fetch(url, options);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                Swal.fire({
                    title: "Exito",
                    text: "Se ha enviado el elemento",
                    icon: "success",
                })
                resetForm();
                setSelectedFile(null);
                setTo(moment().format("YYYY-MM-DD"));
                setFechaTo(moment());
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se logró enviar el elemento",
                    icon: "error",
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se logró conectar al servidor",
                icon: "error",
            })
            console.log({ error })
        }
    }
    return (
        <Layout user={userLogged}>
            <LocalizationProvider locale="es" dateAdapter={AdapterMoment}>

                <Box sx={styles.mainContainer}>
                    <PageTitle title="Agregar nuevo anuncio" />

                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                    >
                        {({ values, handleChange, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField color="secondary" sx={styles.input} label="Texto" name="texto" value={values.texto} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <MobileDatePicker
                                            label="Hasta"
                                            inputFormat="DD-MM-YYYY"
                                            value={fechaTo}
                                            onChange={handleChangeFechaTo}
                                            OpenPickerButtonProps={{ color: "secondary" }}
                                            components={{
                                                ActionBar: MyActionBar
                                            }}
                                            minDate={moment()}
                                            renderInput={(params: any) => <TextField color="secondary" {...params} sx={styles.input} fullWidth />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            selectedFile && (
                                                <>
                                                    <Typography variant="overline">Nombre de archivo</Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">{selectedFile.name}</Typography>
                                                </>
                                            )
                                        }
                                        <Button type="button" variant="contained" color={selectedFile ? "success" : "info"} fullWidth sx={styles.button} onClick={() => ref !== null && ref.current?.click()}>{selectedFile ? 'Cambiar archivo' : 'Seleccionar Archivo'}</Button>

                                        <input
                                            ref={ref as any}
                                            type="file"
                                            style={{ display: "none" }}
                                            accept={"image/*"}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setSelectedFile(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                                e.target.value = "";
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button fullWidth type="submit" color="secondary" variant="contained" sx={styles.button}>Registrar</Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </LocalizationProvider>
        </Layout>
    )
}
const styles = {
    mainContainer: {
        minHeight: "100vh",
        width: "80%",
        margin: "20px auto 0"
    },
    button: {
        textTransform: "none",
        p: 1.8,
        borderRadius: 5,
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
    },
    input: {
        "& fieldset": {
            border: "none"
        },
        "& input": {
            borderRadius: 5,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
        }
    }
}