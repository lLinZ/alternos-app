import { FC, useState, MouseEvent } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Divider } from '@mui/material';
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
];
const settings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
    { name: 'Cerrar sesión', path: "/end" },
];
const adminSettings: Settings[] = [
    { name: 'Mi perfil', path: "/profile" },
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
interface PropsMenuMobile {
    anchorElNav: any;
    currentPath: any;
    handleCloseNavMenu: any;
    handleOpenNavMenu: any;
    pagess: Pages[];
    adminPages: Pages[];
    user: any;

}
interface PropsMenuPc {
    pagess: any;
    currentPath: any;
    push: any;
}

const MenuMobile: FC<PropsMenuMobile> = ({ anchorElNav, currentPath, handleCloseNavMenu, handleOpenNavMenu, pagess, user }) => {
    return (<>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, alignItems: "center", justifyContent: "space-between" }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left', }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'block' }, }}>
                {
                    (user && user.role_name === "Administrador")
                        ? adminPages.map((setting: Pages) => (String(currentPath.pathname) !== String(setting.path) &&
                            (<Link style={{ textDecoration: 'none' }} key={setting.name} to={setting.path}>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" color="text.primary">{setting.name}</Typography>
                                </MenuItem>
                            </Link>)
                        ))
                        : pagess.map((page: Pages) => (String(currentPath.pathname) !== String(page.path) &&
                            (<Link style={{ textDecoration: 'none' }} key={page.name} to={page.path}>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" color="text.primary">{page.name}</Typography>
                                </MenuItem>
                            </Link>))
                        )}
            </Menu>
            <Typography variant="h5" noWrap component="a" href=""
                sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}
            >
                ALTERNOS
            </Typography>
        </Box>
    </>)
}

const MenuPc: FC<PropsMenuPc> = ({ pagess, currentPath, push }) => {

    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'none' } }}>
            {pagess.map((page: Pages) => (
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
    )
}

interface PropsMenuUser {
    handleOpenUserMenu: any;
    anchorElUser: any;
    handleCloseUserMenu: any;
    user: any;
    token: any;
    adminSettings: Settings[];
    settings: Settings[];
    currentPath: any;
}
const MenuUser: FC<PropsMenuUser> = ({ handleOpenUserMenu, anchorElUser, handleCloseUserMenu, user, token, adminSettings, settings, currentPath }) => {

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir configuraciones">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user ? user.name : 'A'} src="/static/images/avatar/2.jpg" />
                    {/*{user.name}
                    </Avatar>*/}
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
                {
                    token && (
                        <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                            {
                                user && (
                                    <>
                                        <Typography variant="subtitle1" color="text.primary" fontWeight="bold">{user.name}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="400" >{user.username}</Typography>
                                        <Typography variant="overline" color="text.secondary" fontWeight="400">{user.role_name}</Typography>
                                    </>
                                )
                            }
                            <Divider />
                        </Box>
                    )
                }
                {token && ((user && user.role_name === "Administrador")
                    ? adminSettings.map((setting: Settings) => (String(currentPath.pathname) !== String(setting.path) &&
                        (<Link style={{ textDecoration: 'none' }} key={setting.name} to={setting.path}>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ color: "text.primary" }}>{setting.name}</Typography>
                            </MenuItem>
                        </Link>)
                    ))
                    : settings.map((setting: Settings) => (String(currentPath.pathname) !== String(setting.path) &&
                        (<Link style={{ textDecoration: 'none' }} key={setting.name} to={setting.path}>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ color: "text.primary" }}>{setting.name}</Typography>
                            </MenuItem>
                        </Link>)
                    ))
                )
                }
            </Menu>
        </Box>
    )
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
    const mobileProps = { anchorElNav, currentPath, handleCloseNavMenu, handleOpenNavMenu, pagess: pages, adminPages, user }
    const pcProps = { push, currentPath, pagess: pages }
    const menuUserProps = { handleOpenUserMenu, anchorElUser, handleCloseUserMenu, user, token, adminSettings, settings, currentPath }

    // Render
    return (
        <AppBar color='secondary' position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" noWrap component="a" sx={{ mr: 2, display: { xs: 'none', md: 'none' }, fontWeight: 700, color: 'inherit', textDecoration: 'none', }}>
                        {title}
                    </Typography>
                    {token && (
                        <>
                            <MenuMobile {...mobileProps} />
                            <MenuUser {...menuUserProps} />
                        </>
                    )}
                    {!token && (<>
                        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'flex' },
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
