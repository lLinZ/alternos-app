import { ChangeEvent, FC, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { validarToken } from '../lib/functions';
import { User } from '../interfaces/user-type';
import { Formik, Form, FormikValues, FormikState } from 'formik';
import { baseUrl } from '../common/baseUrl';

import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';

import CheckCircle from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/CloseRounded';
import Circle from '@mui/icons-material/CircleOutlined';
import { ClientRequest } from 'http';
import { PageTitle } from '../components/ui';

interface BrandCenterInfo {
    etiquetas: string;
    nombre: string;
    ruta: string;
    archivo: string;
    categoria: string;
    miniatura: string;
}

const initialValues: BrandCenterInfo = {
    etiquetas: '',
    nombre: '',
    ruta: '',
    archivo: '',
    categoria: '',
    miniatura: ''
}

export const BrandCenterAddingPage: FC = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [userLogged, setUserLogged] = useState<User | null>(null);
    const [clients, setClients] = useState<User[] | null>(null);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [miniatura, setMiniatura] = useState<File | null>(null);
    const ref = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)

    const router = useNavigate()

    useEffect(() => {
        validarToken(router, setUserLogged)
        getClients();
    }, [])

    const getClients = async () => {
        const url = `${baseUrl}/listaregistros?role_id=2`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        setClients(data.registros)
    }
    const handleCloseModal = () => {
        setOpen(false);
    }
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<BrandCenterInfo>> | undefined) => void,) => {
        let errores = [];
        if (!values.nombre) {
            errores.push("El nombre es obligatorio")
        }
        if (!values.ruta) {
            errores.push("El ruta es obligatorio")
        }
        if (!values.archivo) {
            errores.push("El archivo es obligatorio")
        }
        if (!values.etiquetas) {
            errores.push("Las etiquetas son obligatorias")
        }
        if (!values.miniatura) {
            errores.push("La miniatura es obligatoria")
        }

        const url = `${baseUrl}/registrobrandcenter`;
        const body = new FormData()
        // $client_id = id del cliente
        // $etiquetas = un string de valores separados por coma (',') ese va a ser el separador
        // $nombre    = nombre del elemento que se va a mostrar en el brand center
        // $ruta      = ruta a que carpeta si es una carpeta externa como google drive por ejemplo (incluye el nombre del archivo)
        // $archivo   = nombre del archivo (nuevamente, pero solo el nombre del archivo)
        body.append("user_id", String(selectedClient?.id));
        body.append("nombre", String(values.nombre));
        body.append("etiquetas", String(values.etiquetas));
        body.append("categoria", String(values.categoria));
        body.append("archivo", selectedFile ? selectedFile : '');
        body.append("miniatura", miniatura ? miniatura : '');
        const options = {
            method: "POST",
            body
        }
        try {
            const respuesta = await fetch(url, options)
            const data = await respuesta.json();

            if (data.exito === "SI") {

                Swal.fire({
                    title: "Exito",
                    text: "Archivo enviado",
                    icon: "success"
                })
                resetForm();
                setSelectedClient(null);
                setSelectedFile(null);
                setMiniatura(null);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.mensaje,
                    icon: "error"
                })

            }
        }
        catch (err) {
            console.log(err)
            Swal.fire({
                title: "Error",
                text: "No se logró conectar",
                icon: "error"
            })
        }
    }
    const seleccionarCliente = (id: number) => {
        const selected = clients?.filter((c) => Number(c.id) === id)[0];
        setSelectedClient(selected ? selected : null);
    }
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <PageTitle title="Informacion de Brancenter" />

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                    validateOnBlur={false}
                    validateOnMount={false}
                    validateOnChange={false}
                >
                    {({ values, isSubmitting, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Nombre" name="nombre" onChange={handleChange} value={values.nombre} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth color="secondary" label="Categoría" name="categoria" onChange={handleChange} value={values.categoria} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth color="secondary" label="Etiquetas" name="etiquetas" onChange={handleChange} value={values.etiquetas} sx={styles.input} />
                                </Grid>
                                <Grid item xs={12}>
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
                                    <Button type="button" variant="contained" color={selectedFile ? "success" : "info"} fullWidth sx={styles.button} onClick={() => ref !== null && ref.current?.click()}>{selectedFile ? 'Cambiar archivo' : 'Seleccionar Archivo'}</Button>
                                    {
                                        selectedFile && (
                                            <>
                                                <Typography variant="overline">Nombre de archivo</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{selectedFile.name}</Typography>
                                            </>
                                        )
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <input
                                        ref={ref2 as any}
                                        type="file"
                                        style={{ display: "none" }}
                                        accept={"image/*"}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setMiniatura(e.currentTarget.files ? e.currentTarget.files[0] : null);
                                            e.target.value = "";
                                        }}
                                    />
                                    <Button type="button" variant="contained" color={miniatura ? "success" : "info"} fullWidth sx={styles.button} onClick={() => ref2 !== null && ref2.current?.click()}>{miniatura ? 'Cambiar Miniatura' : 'Seleccionar Miniatura'}</Button>
                                    {
                                        miniatura && (
                                            <>
                                                <Typography variant="overline">Miniatura de portada</Typography>
                                                <Typography variant="subtitle2" color="text.secondary">{miniatura.name}</Typography>
                                            </>
                                        )
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <Button fullWidth disableElevation disabled={isSubmitting} sx={styles.buttonModal} type="button" onClick={() => setOpen(true)} variant="contained">Seleccionar cliente</Button>
                                </Grid>
                                {
                                    selectedClient && (
                                        <Grid xs={12}>
                                            <Box sx={styles.selectedClientContainer}>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Cliente seleccionado</Typography>
                                                    <Typography variant="subtitle2" fontSize={12} color="text.secondary">{selectedClient?.name}</Typography>
                                                </Box>
                                                <Box>
                                                    <CheckCircle color="success" />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={12}>
                                    <Button fullWidth disableElevation disabled={isSubmitting} color="secondary" sx={styles.button} type="submit" variant="contained">Agregar</Button>
                                </Grid>
                            </Grid>
                        </Form>

                    )}
                </Formik>
                <Dialog onClose={handleCloseModal} open={open} fullScreen PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)" } }}>
                    <AppBar sx={{ position: 'relative', boxShadow: "0 8px 32px 0 rgba(100,100,100,0.1)" }} elevation={0}>
                        <Toolbar>
                            <Box sx={styles.toolbarContainer}>

                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    Seleccionar Cliente
                                </Typography>
                                <Button
                                    color="success"
                                    variant="contained"
                                    disableElevation
                                    size="small"
                                    onClick={handleCloseModal}
                                    sx={styles.buttonGuardarCambios}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    {
                        clients && (
                            <Box sx={styles.clientsContainer}>
                                {clients.map((client) => (
                                    <Box sx={styles.clientContainer} key={client.id}>
                                        <Typography variant="subtitle2" fontWeight="bold">{client.name}</Typography>
                                        <IconButton disabled={Number(selectedClient?.id) === Number(client.id)} onClick={() => seleccionarCliente(Number(client.id))}>
                                            {Number(selectedClient?.id) === Number(client.id) ? <CheckCircle color="success" /> : <Circle />}
                                        </IconButton>
                                    </Box>))}
                            </Box>
                        )
                    }
                </Dialog>
            </Box>
        </Layout>
    )
}
const styles = {
    input: {
        color: "black",
        "& fieldset": {
            border: "none",
        },
        "& input": {
            borderRadius: 3,
            background: "#fff",
            color: "black",
            boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)"
        }
    },
    button: {
        p: 2,
        borderRadius: 3,
        textTransform: "none"
    },
    selectedClientContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2
    },
    buttonModal: {
        p: 2,
        borderRadius: 3,
        textTransform: "none",
        boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)"
    },
    clientsContainer: {
        width: "80%",
        margin: "20px auto",
        minHeight: "100vh"
    },
    clientContainer: {
        width: "100%",
        borderRadius: 5,
        background: "#FFF",
        p: 3,
        mb: 2,
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 32px 0 rgba(100,100,100,0.2)"
    },
    buttonGuardarCambios: {
        paddingBlock: 0.5,
        paddingInline: 1.3,
        borderRadius: 5,
    },
    toolbarContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexFlow: "row wrap"
    }
}