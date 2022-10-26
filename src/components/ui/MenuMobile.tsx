import { FC, useState, MouseEvent, KeyboardEvent } from 'react'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/MenuRounded';

import { AdminList, DrawerComponent, UserInfo, UserList } from './mobileMenu';
import { User } from '../../interfaces/user-type';
import { Drawer, Divider, Typography } from '@mui/material';
import { List } from 'react-content-loader';
import { UserPlaceholder, MenuTextPlaceholder } from '../placeholder';
import { Pages } from '../../interfaces/pages-type';

interface Props {
    user: User | null;
    pages: Pages[];
    adminPages: Pages[];
}
export const MenuMobile: FC<Props> = ({ user, pages, adminPages }) => {
    const [state, setState] = useState<boolean>(false);
    const toggleDrawer =
        (open: boolean) =>
            (event: KeyboardEvent | MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as KeyboardEvent).key === 'Tab' ||
                        (event as KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState(open);
            };
    return (<>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, alignItems: "center", justifyContent: "space-between" }}>
            <Button size="large" onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
            </Button>
            <Box sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, flexGrow: 1, textDecoration: 'none', }}>
                <img src='/logo.png' width='171' height='49' />
            </Box>
        </Box>
        <DrawerComponent user={user} toggleDrawer={toggleDrawer} state={state} pages={pages} adminPages={adminPages} />
    </>
    )
}