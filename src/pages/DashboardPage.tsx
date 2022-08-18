import { Box } from '@mui/material'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { baseUrl } from '../common/baseUrl'
import { WidgetList } from '../components/dashboard'
import { Layout } from '../components/layout'
import { getCookieValue, validarToken } from '../lib/functions'

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
    const router = useNavigate();
    useEffect(() => {
        validarToken(router, setUserLogged, setWidgets);
    }, []);
    return (
        <Layout title="Dashboard" user={userLogged}>
            <Box sx={{ width: "80%", m: "auto" }}>
                <WidgetList widgets={widgetsS} />
            </Box>
        </Layout>
    )
}
