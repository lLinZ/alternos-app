import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { baseUrl } from '../common/baseUrl';
import { Layout } from '../components/layout';
import { ProcessList } from '../components/process/ProcessList';
import { Process } from '../interfaces/process-type';
import { validarToken } from '../lib/functions';

export const ProcessListPage: FC = () => {

    // Usuario logeado
    const [userLogged, setUserLogged] = useState();

    // Procesos registrados
    const [processes, setProcesses] = useState<Process[] | null>(null);

    // Router
    const router = useNavigate();


    /**
     * Funcion para obtener informacion de los procesos
     */
    const getProcesses = async () => {
        const url = `${baseUrl}/listaprocesos`;

        const options = {
            method: "GET",
        }
        const respuesta = await fetch(url, options)
        const data = await respuesta.json();

        if (data.exito === "SI") {
            console.log(data);
            setProcesses(data.registros);
        } else {
            Swal.fire({
                title: "Error",
                text: "Ocurrio un error al consultar los procesos",
                icon: "error"
            })
        }
    }

    // Efecto secundario
    useEffect(() => {
        validarToken(router, setUserLogged);
        getProcesses();
    }, [])

    // Render
    return (
        <Layout user={userLogged} title="Procesos registrados">

            <ProcessList processes={processes && processes.length > 0 ? processes : null} setProcesses={setProcesses} />

        </Layout>
    )
}
