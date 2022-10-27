import { FC } from 'react'

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import { pages } from '../pages';
import { Pages } from '../../../interfaces/pages-type';

export const UserList: FC = () => {
    const router = useNavigate();
    const currentPath = useLocation();
    const redirect = (path: string) => {
        router(path);
    }
    return (
        <>
            {
                pages.map((page: Pages, i: number) => (String(currentPath.pathname) !== String(page.path) ?

                    page.name === 'divider'
                        ? (
                            <Box key={`${i + 42}${page.name}${i}`} sx={{ mb: -1 }}>
                                <Divider />
                                <Typography sx={{ ml: 2 }} variant="overline" color="text.secondary" fontWeight="bold">{page.path}</Typography>
                            </Box>
                        ) : (
                            <ListItem key={`${i + 42}${page.name}${i}`} disablePadding>
                                <ListItemButton dense onClick={() => redirect(page.path)}>
                                    <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    : (<ListItem sx={{ background: "rgba(100,100,100,0.1)" }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
        </>
    )
}
