import { FC, useState, MouseEvent } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCookieValue } from '../../lib/functions';
import { User } from '../../interfaces/user-type';

type Pages = {
    name: string;
    path: string
}
type Settings = {
    name: string;
    path: string
}

const pages: Pages[] = [
    { name: 'Dashboard', path: "/dashboard" }
];
const settings: Settings[] = [
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Agregar Requerimiento', path: "/requirements/add" },
    { name: 'Procesos', path: "/process" },
    { name: 'Agregar procesos', path: "/process/add" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: 'Cerrar sesión', path: "/end" },
];
const adminSettings: Settings[] = [
    { name: 'Cerrar sesión', path: "/end" },
    { name: 'Mis tareas', path: "/requirements" },
    { name: 'Agregar Requerimiento', path: "/requirements/add" },
    { name: 'Procesos', path: "/process" },
    { name: 'Agregar procesos', path: "/process/add" },
    { name: "Administrar usuarios", path: "/admin" },
    { name: 'Cerrar sesión', path: "/end" },
]
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
    user: User;
}
export const AppBarComponent: FC<Props> = ({ title, user }) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    // Token del usuario logeado
    const token = getCookieValue("token");

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Router
    const push = useNavigate();

    // Direccion actual
    const currentPath = useLocation();
    console.log({ user })
    // Render
    return (
        <AppBar color='secondary' position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {title}
                    </Typography>
                    {token && (
                        <>

                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {pages.map((page) => (
                                        String(currentPath.pathname) !== String(page.path) && (

                                            <Link style={{ textDecoration: 'none' }} key={page.name} to={page.path}>
                                                <MenuItem onClick={handleCloseNavMenu}>
                                                    <Typography textAlign="center">{page.name}</Typography>
                                                </MenuItem>
                                            </Link>
                                        )
                                    ))}
                                </Menu>
                            </Box>
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                ALTERNOS
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {pages.map((page) => (
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

                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Abrir configuraciones">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {token && (
                                        (user && user.role_name === "Administrador")
                                            ? settings.map((setting) => (
                                                String(currentPath.pathname) !== String(setting.path) && (

                                                    <Link style={{ textDecoration: 'none' }} key={setting.name} to={setting.path}>
                                                        <MenuItem onClick={handleCloseUserMenu}>
                                                            <Typography textAlign="center">{setting.name}</Typography>
                                                        </MenuItem>
                                                    </Link>
                                                )))
                                            : settings.map((setting) => (
                                                String(currentPath.pathname) !== String(setting.path) && (

                                                    <Link style={{ textDecoration: 'none' }} key={setting.name} to={setting.path}>
                                                        <MenuItem onClick={handleCloseUserMenu}>
                                                            <Typography textAlign="center">{setting.name}</Typography>
                                                        </MenuItem>
                                                    </Link>
                                                ))))}
                                </Menu>
                            </Box>
                        </>
                    )}
                    {!token && (<>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            ALTERNOS
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
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
        </AppBar>
    );
};
