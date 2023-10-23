import React, { Dispatch, FC, SetStateAction } from 'react'

import { Box, Typography, IconButton } from '@mui/material';

import { Process } from '../../interfaces/process-type';
import { ProcessCard } from './ProcessCard';
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '../ui';
import { FilterBox } from '../data/FilterBox';

interface Props {
    processes: Process[] | null;
    setProcesses: Dispatch<SetStateAction<Process[] | null>>
}

export const ProcessList: FC<Props> = ({ processes, setProcesses }) => {
    const router = useNavigate();
    return (
        <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
            <PageTitle title="Lista de procesos" navigate='/process/add' />
            {processes && (<FilterBox data={processes} setData={setProcesses} category1="name" category2="description" category3="owner_name" />)}
            {/* Si hay procesos */}
            {processes && processes.map((p: Process) => <ProcessCard key={p.id} process={p} setProcesses={setProcesses} processes={processes} />)}

            {/* Si no hay procesos */}
            {!processes && (<Typography variant="body1" color="text.secondary">No existen procesos</Typography>)}
        </Box>
    )
}
