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
                <Masonry columns={{ xs: 1, sm: 2, md: 3, xl: 4 }} spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: "center" }}>
                    {/* Si hay procesos */}
                    {processes?.map((p: Process) => <ProcessCard key={p.id} process={p} setProcesses={setProcesses} />)}

                    {/* Si no hay procesos */}
                    {!processes && (<Typography variant="body1" color="text.secondary">No existen procesos asignados a tu usuario actualmente</Typography>)}
                </Masonry>
            </Box>
        </>
    )
}
