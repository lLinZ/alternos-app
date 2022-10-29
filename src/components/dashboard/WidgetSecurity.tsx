import { FC, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
interface Props {

}
export const WidgetSecurity: FC<Props> = () => {
    const [dismissed, setDismissed] = useState<string>("block");
    const router = useNavigate();
    return (
        <Box sx={{ position: "relative", display: dismissed, width: "100%", mt: -5 }}>
            <IconButton sx={{ position: "absolute", top: 0, right: 5, zIndex: 90 }} onClick={() => setDismissed('none')}><CloseRounded /></IconButton>
            <Box sx={{ width: "100%", height: "100%", background: "#FFF", overflow: "hidden", cursor: "pointer", boxShadow: '0 8px 32px 0 rgba(100,100,100,0.3)', "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, position: "relative" }} onClick={() => router("/profile")}>
                <Box sx={{ display: "flex", flexFlow: "row wrap", justifyContent: "center", alignItems: "center", width: "100%", }}>
                    <img src="./security.jpg" style={{ width: 100 }} />
                    <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="left" fontSize={{ xs: 12, md: 14 }}>Recuerda actualizar tu información</Typography>
                        <Typography variant="subtitle2" fontWeight="400" textAlign="left" color="text.secondary" fontSize={{ xs: 12, md: 14 }}>En la opción &quot;Mi perfil&quot; en el menú de usuario puedes modificarla cuando quieras</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
