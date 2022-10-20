import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {

}

export const WidgetInformativo: FC<Props> = () => {
    return (
        <Box sx={{ width: { xs: "100%", sm: 400 }, height: "100%", background: "#FFF", borderRadius: 5, mb: 1, overflow: "hidden", pb: 2 }}>
            <Box sx={{ display: "flex", flexFlow: "column wrap", justifyContent: "center", alignItems: "center", width: "100%", p: 1 }}>
                <img src="./dashboard-image.jpg" style={{ minWidth: 80, maxWidth: 200, width: "auto" }} />
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">¡Ponte al día con tus tareas!</Typography>
                <Typography variant="subtitle2" fontWeight="400" color="text.secondary" sx={{ textAlign: "center" }}>Utiliza los widgets para acceder más rapido a diferentes interfaces</Typography>
            </Box>
        </Box>
    )
}
