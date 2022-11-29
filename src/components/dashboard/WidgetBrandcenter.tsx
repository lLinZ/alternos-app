import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { getCookieValue } from '../../lib/functions';

export const WidgetBrandcenter: FC = () => {
    const token = getCookieValue("token")
    const username = getCookieValue("username")
    return (
        <Box sx={styles.mainContainer} onClick={() => window.open(`https://alternos.sgc-consultores.com.ve/brandcenter?token=${token}&username=${username}`, '_blank')}>
            <Box sx={styles.content}>
                <img src="./brandcenter.webp" style={{ width: 160, margin: "auto" }} />
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center" fontSize={12}>¡Visita el brandcenter!</Typography>
                <Typography variant="subtitle2" fontSize={12} color="text.secondary" sx={{ textAlign: "center" }}>Accede directamente al brandcenter</Typography>
            </Box>
        </Box>
    )
}
const styles = {
    mainContainer: {
        cursor: "pointer",
        boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
        minWidth: {
            xs: "100%",
            sm: 450
        },
        maxWidth: {
            xs: "100%",
            sm: 450
        },
        height: "100%",
        minHeight: 250,
        maxHeight: 250,
        background: "#FFF",
        borderRadius: 5,
        m: 1,
        overflow: "hidden",
        pb: 2
    },
    content: {
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        p: 1,
    },
}