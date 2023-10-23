import React, { FC, useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';

import { UserList } from '../components/admin/UserList';
import { Layout } from '../components/layout';

import { baseUrl } from '../common/baseUrl';

import { User } from '../interfaces/user-type';
import { useNavigate } from 'react-router-dom';
import { validarToken } from '../lib/functions';
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { PageTitle } from '../components/ui';

export const AdminPage: FC = () => {

    // Usuarios
    const [users, setUsers] = useState<User[] | null>(null);

    //Usuario logeado
    const [userLogged, setUserLogged] = useState<User | null>(null);

    
    const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches);

    useEffect(() => {
        window
        .matchMedia("(min-width: 768px)")
        .addEventListener('change', e => setMatches( e.matches ));
    }, []);

    //Router
    const router = useNavigate();

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
        validarToken(router, setUserLogged);
    }, [])

    // Render
    return (
        <Layout title="Administradores" user={userLogged}>

            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", alignItems: "center", flexFlow: "row nowrap" }}>
                    <PageTitle title="Usuarios registrados" />
                    <IconButton size="small" color="info" onClick={() => router("/admin/user/add")}><AddIcon /></IconButton>
                </Box>
                <UserList users={users} setUsers={setUsers} matches={matches} />
            </Box>
        </Layout>
    )
}
