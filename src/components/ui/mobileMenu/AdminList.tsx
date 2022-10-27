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

export const AdminList: FC = () => {
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
                                <Box key={`${i + 42}${setting.name}${i}`} sx={{ mb: -1 }}>
                                    <Divider />
                                    <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{setting.path}</Typography>
                                </Box>
                            )
                            : (<ListItem key={`${i + 42}${setting.name}${i}`} disablePadding>
                                <ListItemButton dense onClick={() => redirect(setting.path)}>
                                    <ListItemText primary={setting.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>)
                    )
                    : (<ListItem sx={{ background: "rgba(100,100,100,0.1)" }} key={`${i + 42}${setting.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={setting.name} primaryTypographyProps={{ fontSize: 12 }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
        </>
    )
}