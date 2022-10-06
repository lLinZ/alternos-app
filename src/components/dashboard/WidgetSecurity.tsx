import { FC, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
interface Props {

}
export const WidgetSecurity: FC<Props> = () => {
    const [dismissed, setDismissed] = useState<string>("block");
    const router = useNavigate();
    return (<Box sx={{ position: "relative", display: dismissed, }}>
        <IconButton sx={{ position: "absolute", top: 0, right: 5, zIndex: 90 }} onClick={() => setDismissed('none')}><CloseRounded /></IconButton>
        <Box sx={{ width: "100%", height: "100%", background: "#FFF", borderRadius: 5, mb: 1, overflow: "hidden", cursor: "pointer", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, position: "relative" }} onClick={() => router("/profile")}>
            <Box sx={{ display: "flex", flexFlow: "column wrap", justifyContent: "center", alignItems: "center", width: "100%", p: 2 }}>
                <img src="./security.jpg" style={{ minWidth: 80, maxWidth: 200, width: "auto" }} />
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">Recuerda actualizar tu información</Typography>
                <Typography variant="subtitle2" fontWeight="400" color="text.secondary" sx={{ textAlign: "center" }}>En la opción &quot;Mi perfil&quot; en el menú de usuario puedes modificarla cuando quieras</Typography>
            </Box>
        </Box>
    </Box>
    )
}
