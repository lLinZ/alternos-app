import { FC } from 'react'

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
                    (
                        <ListItem key={`${i + 42}${page.name}${i}`} disablePadding>
                            <ListItemButton dense onClick={() => redirect(page.path)}>
                                <ListItemText primary={page.name} primaryTypographyProps={{ fontSize: 12 }} />
                            </ListItemButton>
                        </ListItem>
                    )
                    : (<ListItem sx={{ background: "rgba(0,0,0,0.9)" }} key={`${i + 42}${page.name}${i}`} disablePadding>
                        <ListItemButton dense>
                            <ListItemText primary={page.name} primaryTypographyProps={{ color: "#FFF", fontSize: 12 }} />
                        </ListItemButton>
                    </ListItem>)
                ))
            }
        </>
    )
}
