import { FC, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { UserList } from '../components/admin/UserList';
import { Layout } from '../components/layout';

import { baseUrl } from '../common/baseUrl';

import { User } from '../interfaces/user-type';


export const AdminPage: FC = () => {

    // Usuarios
    const [users, setUsers] = useState<User[] | null>(null);


    /**
     * Funcion para obtener usuarios segun el rol y el status
     * @param role Rol de los usuarios a buscar
     * @param status Status de los usaurios a buscar
     */
    const getUsers = async (role?: number, status?: string) => {

        const url = role && status
            ? `${baseUrl}/listaregistros?role=${role}&status=${status}`
            : `${baseUrl}/listaregistros`
        const options = {
            method: "GET",
        }
        try {
            const respuesta = await fetch(url, options);

            const data = await respuesta.json();
            console.log(data)
            if (data.exito === "SI") {
                setUsers(data.registros);
            } else {
                setUsers(null);
            }
        } catch (error) {
            console.log(error);
            setUsers(null);
        }
    }

    useEffect(() => {
        getUsers(99);
    }, [])

    // Render
    return (
        <Layout title="Administradores">
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 4 }}>Lista de usuarios registrados</Typography>
            <UserList users={users} setUsers={setUsers} />
        </Layout>
    )
}
