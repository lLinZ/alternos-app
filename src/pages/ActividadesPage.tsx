import { FC, useEffect, useState } from "react";

import { Box } from "@mui/material";

import { Layout } from "../components/layout"
import { validarToken } from "../lib/functions";
import { useNavigate } from "react-router-dom";

interface Props {

}
export interface Actividades {
    actividades: any[];
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
}
export const ActividadesPage: FC<Props> = () => {
    const [userLogged, setUserLogged] = useState();
    const [actividades, setActividades] = useState<Actividades[]>();
    const router = useNavigate();

    const getInformation = async () => {
        const url = "https://alternos.sgc-consultores.com.ve/api/listaprocesos?detalle=&id_proceso=&id_owner";

        const options = {
            method: "GET",
        }
        const respuesta = await fetch(url, options)
        const data = await respuesta.json();

        if (data.exito === "SI") {
            setActividades(data.registros);
            console.log(data);
        } else {
            console.log("ERROR");
        }
    }
    useEffect(() => {
        validarToken(router, setUserLogged)
        getInformation();
    }, []);
    return (
        <Layout user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                {/* {actividades && actividades.map((actividad) => (
                    <Box key={actividad.id} sx={{ mt: 2, p: 2, border: "1px solid rgba(0,0,0,0.5)", borderRadius: "10px" }}>
                        <Typography variant="subtitle1" >{actividad.name}</Typography>
                        <Typography variant="subtitle2">{actividad.owner_name}</Typography>
                    </Box>
                ))} */}
                {/* <Formik children={undefined} initialValues={undefined} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                    throw new Error("Function not implemented.");
                }}>
                    {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                        <Form>
                            <Grid container>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                                <Grid item xs={12} sm={6} m={4}>
                                    <TextField />
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik> */}
            </Box>
        </Layout>
    )
}
