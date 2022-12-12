import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ArrowBack from '@mui/icons-material/ArrowBackRounded';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react'
import { useNavigate } from 'react-router-dom';

interface Props {
    title: string;
    navigate?: string;
}

export const PageTitle: FC<Props> = ({ title, navigate = '' }) => {

    const router = useNavigate();
    const goBack = () => {
        router(-1);
    }
    return (
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", flexFlow: "row nowrap" }}>
            <IconButton size="small" onClick={goBack}>
                <ArrowBack />
            </IconButton>
            <Typography variant="overline" fontWeight={'bold'}>{title}</Typography>
            {navigate !== '' && (<IconButton color="info" onClick={() => router(navigate)}><AddIcon /></IconButton>)}
        </Box>
    )
}
