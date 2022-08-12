import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../lib/functions';

export const EndPage: FC = () => {

    // Router
    const push = useNavigate();

    // Borrar cookie y reenviar al login
    useEffect(() => {
        deleteCookie("token");
        push("/");
    }, [])

    // Render
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography variant="subtitle1">Cerrando sesión...</Typography>
        </Box>
    )
}
