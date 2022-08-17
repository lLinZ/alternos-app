import { Box } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { WidgetList } from '../components/dashboard'
import { Layout } from '../components/layout'
import { getCookieValue } from '../lib/functions'

interface Props {

}
const widgets = [
    {
        id: 1,
        name: "Widget 1"
    },
    {
        id: 2,
        name: "Widget 2"
    },
    {
        id: 3,
        name: "Widget 3"
    },
    {
        id: 4,
        name: "Widget 4"
    },
    {
        id: 5,
        name: "Widget 5"
    },
    {
        id: 6,
        name: "Widget 6"
    },
]
export const DashboardPage: FC<Props> = () => {

    const [userLogged, setUserLogged] = useState(null);

    const [widgetsS, setWidgets] = useState();
    const validarToken = async () => {
        const token = getCookieValue("token");
        const username = getCookieValue("username");

        const body = new FormData();

        body.append("username", username);
        body.append("token", token);
        const url = `${baseUrl}/validToken`;

        const options = {
            method: "POST",
            body
        }

        try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                console.log(data);
                const newUser = data.usuario;
                const newWidgets = data.widgets;
                setUserLogged(newUser);
                setWidgets(newWidgets);
            } else {
                const alertaError1 = await Swal.fire({
                    title: "Error",
                    text: "Autentiquese correctamente",
                    icon: "error"
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        validarToken();
    }, []);
    return (
        <Layout title="Dashboard" user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                <WidgetList widgets={widgetsS} />
            </Box>
        </Layout>
    )
}
