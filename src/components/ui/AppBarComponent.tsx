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
        <AppBar color='transparent' position="sticky" elevation={0} sx={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(4px)' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {token && (
                        <>
                            <MenuMobile user={user} />
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
