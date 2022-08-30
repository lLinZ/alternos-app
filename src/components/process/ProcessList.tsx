import { Dispatch, FC, SetStateAction } from 'react'

import { Box, Typography } from '@mui/material';

import { Process } from '../../interfaces/process-type';
import { ProcessCard } from './ProcessCard';
import { Masonry } from '@mui/lab';

interface Props {
    processes?: Process[];
    setProcesses: Dispatch<SetStateAction<Process[] | null>>
}

export const ProcessList: FC<Props> = ({ processes, setProcesses }) => {

    return (
        <>
            <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
                <Typography variant="overline" component="h2" fontWeight="bold" fontSize={16} sx={{ mb: 2 }}>Lista de procesos registrados</Typography>
                {/* Si hay procesos */}
                {processes?.map((p: Process) => <ProcessCard key={p.id} process={p} setProcesses={setProcesses} />)}

                {/* Si no hay procesos */}
                {!processes && (<Typography variant="body1" color="text.secondary">No existen procesos asignados a tu usuario actualmente</Typography>)}
            </Box>
        </>
    )
}
