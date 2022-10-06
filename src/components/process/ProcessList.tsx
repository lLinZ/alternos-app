import { Dispatch, FC, SetStateAction } from 'react'

import { Box, Typography, IconButton } from '@mui/material';

import { Process } from '../../interfaces/process-type';
import { ProcessCard } from './ProcessCard';
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { useNavigate } from 'react-router-dom';

interface Props {
    processes?: Process[];
    setProcesses: Dispatch<SetStateAction<Process[] | null>>
}

export const ProcessList: FC<Props> = ({ processes, setProcesses }) => {
    const router = useNavigate();
    return (
        <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "start" }}>
                <Typography variant="overline" component="h2" fontWeight="bold" fontSize={16} sx={{ mb: 2 }}>Lista de procesos registrados</Typography>
                <IconButton color="info" onClick={() => router("/process/add")}><AddIcon /></IconButton>
            </Box>
            {/* Si hay procesos */}
            {processes?.map((p: Process) => <ProcessCard key={p.id} process={p} setProcesses={setProcesses} />)}

            {/* Si no hay procesos */}
            {!processes && (<Typography variant="body1" color="text.secondary">No existen procesos asignados a tu usuario actualmente</Typography>)}
        </Box>
    )
}
