import React, { FC, useState, MouseEvent, KeyboardEvent } from 'react'

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/MenuRounded';
import Button from '@mui/material/Button';

import { DrawerComponent, } from './mobileMenu';
import { User } from '../../interfaces/user-type';
import { useNavigate } from 'react-router-dom';

interface Props {
    user: User | null;
}
export const MenuMobile: FC<Props> = ({ user, }) => {
    // Router
    const push = useNavigate();

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
            <IconButton onClick={toggleDrawer(true)} color="primary">
                <MenuIcon />
            </IconButton>
            <Box sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, flexGrow: 1, textDecoration: 'none', }}>
                <Button onClick={() => push('/dashboard')}>
                    <img src='/logo.png' width='120' height='35' alt='Logo alternos' />
                </Button>
            </Box>
        </Box>
        <DrawerComponent user={user} toggleDrawer={toggleDrawer} state={state} />
    </>
    )
}