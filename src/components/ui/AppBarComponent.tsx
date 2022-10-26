import { FC } from 'react';

import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { useLocation, useNavigate } from 'react-router-dom';

import { getCookieValue } from '../../lib/functions';

import { User } from '../../interfaces/user-type';

import { MenuMobile, MenuUser } from '.';
import { Settings } from "../../interfaces/settings-type";
import { Pages } from "../../interfaces/pages-type";

const settings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
    { name: 'Cerrar sesión', path: "/end" },
];
const adminSettings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: "Revision de pagos", path: "/pagos" },
    { name: "Agregar admin", path: "/register/admin" },
    { name: 'Cerrar sesión', path: "/end" },
]

const pages: Pages[] = [
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Dashboard', path: "/dashboard" }
];
const adminPages: Pages[] = [
    { name: 'Dashboard', path: "/dashboard" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Procesos', path: "/process" },
    { name: 'Agregar procesos', path: "/process/add" },
    { name: 'Asignacion', path: "/assignment" },
    { name: 'Lista de actividades', path: "/activity" },
    { name: 'Agregar actividad', path: "/activity/add" },
    { name: 'Informacion para Brandcenter', path: "/brandcenter/add" },
    { name: 'divider', path: "Resúmenes" },
    { name: "Resumen de procesos", path: "/process/resume" },
    { name: "Resumen de actividades", path: "/activity/resume" },
    { name: "Resumen de casos", path: "/requirements/resume" },
    { name: "Analisis por caso", path: "/analisis/resume" },
    { name: "Status por caso", path: "/casos/status/resume" },
    { name: "Tareas por usuario", path: "/tareas/resume" },
    { name: "Resumen de cumplimiento", path: "/users/cumplimiento/resume" },
    { name: "Resumen de transacciones", path: "/transacciones/resume" },
];
const notLoggedPages: Pages[] = [
    {
        name: "Log In",
        path: "/",
    },
    {
        name: "Registrarse",
        path: "/register"
    }
]

interface Props {
    title: string;
    user: User | null;
}

export const AppBarComponent: FC<Props> = ({ title, user }) => {

    // Router
    const push = useNavigate();

    const token = getCookieValue('token');

    // Direccion actual
    const currentPath = useLocation();

    // Render
    return (
        <AppBar color='secondary' position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {token && (
                        <>
                            <MenuMobile user={user} adminPages={adminPages} pages={pages} />
                            <MenuUser user={user} />
                        </>
                    )}
                    {!token && (<>
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <img src='/logo.png' width='171' height='49' alt='Logo alternos' />
                            {notLoggedPages.map((page) => (
                                String(currentPath.pathname) !== String(page.path) && (
                                    <Button
                                        key={page.name + 2}
                                        onClick={() => push(page.path)}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.name}
                                    </Button>
                                )))}
                        </Box>
                    </>
                    )}
                </Toolbar>
            </Container>
        </AppBar >
    );
};
