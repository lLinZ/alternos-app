import { FC, useState, MouseEvent, KeyboardEvent } from 'react'

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/MenuRounded';

import { DrawerComponent, } from './mobileMenu';
import { User } from '../../interfaces/user-type';

interface Props {
    user: User | null;
}
export const MenuMobile: FC<Props> = ({ user, }) => {
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
            <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
            </IconButton>
            <Box sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, flexGrow: 1, textDecoration: 'none', }}>
                <img src='/logo.png' width='171' height='49' />
            </Box>
        </Box>
        <DrawerComponent user={user} toggleDrawer={toggleDrawer} state={state} />
    </>
    )
}