import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react'
import { Widget } from '../../interfaces/widget-type';

interface Props {
    widget: Widget;
}
export const WidgetCard: FC<Props> = ({ widget }) => {
    const theme = useTheme();
    console.log(theme)
    return (
        <Box display="flex" flexDirection="column" sx={{ background: theme.palette.secondary.main }}>
            <Box id="title" sx={{ background: theme.palette.secondary.dark }}>
                <Typography variant="subtitle1"></Typography>
            </Box>
            <Box id="content">

            </Box>
        </Box>
    )
}
