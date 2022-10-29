import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {

}

export const WidgetInformativo: FC<Props> = () => {
    return (
        <Box sx={{ boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)', minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, height: "100%", minHeight: 250, maxHeight: 250, background: "#FFF", borderRadius: 5, mb: 1, overflow: "hidden", pb: 2 }}>
            <Box sx={{ display: "flex", flexFlow: "column wrap", justifyContent: "center", alignItems: "center", width: "100%", p: 1 }}>
                <img src="./dashboard-image.jpg" style={{ width: 160, margin: "auto" }} />
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center" fontSize={12}>¡Ponte al día con tus tareas!</Typography>
                <Typography variant="subtitle2" fontSize={12} color="text.secondary" sx={{ textAlign: "center" }}>Utiliza los widgets para acceder más rapido a diferentes interfaces</Typography>
            </Box>
        </Box>
    )
}
