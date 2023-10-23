import { Box, Typography, useTheme } from '@mui/material';
import React, { FC } from 'react'
import { Widget } from '../../interfaces/widget-type';

interface Props {
    widget: Widget;
}

export const WidgetCard: FC<Props> = ({ widget }) => {
    // Tema
    const theme = useTheme();

    // Render
    return (
        <Box display="flex" flexDirection="column" sx={{
            background: theme.palette.secondary.main, borderRadius: "10px", cursor: "pointer", transition: ".3s ease all", "&:hover": {
                boxShadow: "0 0 8px rgb(0,0,0)"
            }
        }}>
            <Box id="title" sx={{ background: theme.palette.secondary.dark, p: 1, borderRadius: "10px 10px 0 0" }}>
                <Typography variant="subtitle1" sx={{ color: "#FFF" }}>{widget.name}</Typography>
            </Box>
            <Box id="content" sx={{ p: 2, color: "#FFF", minHeight: "200px" }}>
                Contenido del widget
            </Box>
        </Box>
    )
}
