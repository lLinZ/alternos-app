import { FC } from 'react'

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import { administracionPages, traficoPages, ventasPages, usuarioPages, clientePages, invitadoPages } from '../pages';
import { Pages } from '../../../interfaces/pages-type';
import { User } from '../../../interfaces/user-type';
import AdjustIcon from '@mui/icons-material/Lens';
interface Props {
    user: User | null;
}

export const UserList: FC<Props> = ({ user }) => {
    const router = useNavigate();
    const currentPath = useLocation();
    const redirect = (path: string) => {
        router(path);
    }
    return (
        <>
            {
                // Rol Tráfico
                Number(user?.role_id) === 5 && traficoPages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
            {
                // Rol Comercial
                Number(user?.role_id) === 4 && ventasPages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
            {
                // Rol Cliente
                Number(user?.role_id) === 2 && clientePages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
            {
                // Rol Usuario
                Number(user?.role_id) === 3 && usuarioPages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
            {
                // Rol Administracion
                Number(user?.role_id) === 6 && administracionPages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
            {
                // Rol Invitado
                Number(user?.role_id) === 99 && invitadoPages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider sx={{
                                    borderRadius: "100%", height: "1px", width: "100%",
                                    background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                }} />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} sx={{ borderRadius: 3, mt: 0.5, overflow: 'hidden' }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, mt: 0.5, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }

        </>
    )
}
