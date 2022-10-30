import { FC } from 'react'

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { Pages } from '../../../interfaces/pages-type';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminPages } from '../pages';
import AdjustIcon from '@mui/icons-material/Lens';
import { User } from '../../../interfaces/user-type';
interface Props {
    user: User | null;
}
export const AdminList: FC<Props> = ({ user }) => {
    const router = useNavigate();
    const currentPath = useLocation();
    const redirect = (path: string) => {
        router(path);
    }
    return (
        <>
            {
                adminPages.map((setting: Pages, i: number) => (String(currentPath.pathname) !== String(setting.path) ?
                    (
                        setting.name === 'divider'
                            ? (
                                <Box key={`${i + 42}${setting.name}${i}`} sx={{ mb: -1, mt: 0.5 }}>
                                    <Divider sx={{
                                        borderRadius: "100%", height: "1px", width: "100%",
                                        background: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                        WebkitBackground: "radial-gradient(circle, rgba(54,54,54,0.1) 0%, rgba(199,199,199,0.1) 100%)",
                                    }} />
                                    <Typography sx={{ ml: 2 }} variant="overline" color="text.primary" fontWeight={700}>{setting.path}</Typography>
                                </Box>
                            )
                            : (<ListItem key={`${i + 42}${setting.name}${i}`} sx={{ borderRadius: 3, overflow: 'hidden', mt: 0.5 }} disablePadding>
                                <ListItemButton dense onClick={() => redirect(setting.path)}>
                                    <ListItemText primary={setting.name} primaryTypographyProps={{ color: 'text.secondary', fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>)
                    )
                    : (<ListItem sx={{ background: "rgba(255,255,255,1)", borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(150,150,150,0.5)', overflow: 'hidden' }} key={`${i + 42}${setting.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={setting.name} primaryTypographyProps={{ color: 'text.secondary', fontSize: 12, fontWeight: 'bold' }} />
                            <AdjustIcon sx={{ color: user ? user.coloravatar : 'secondary' }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
        </>
    )
}