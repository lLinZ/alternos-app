import { Dialog, AppBar, Toolbar, IconButton, Typography, Box, Button, CircularProgress, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Dispatch, FC, forwardRef, ReactElement, Ref, SetStateAction, useEffect, useState } from 'react'
import { baseUrl } from '../../common/baseUrl';
import CloseIcon from '@mui/icons-material/Close';
import { ISelectedProcess, IProcessNoDetails } from '../../interfaces/process-type';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface Props {
    setSelectedProcess: Dispatch<SetStateAction<ISelectedProcess | null>>;
}
export const ProcessesModal: FC<Props> = ({ setSelectedProcess }) => {
    const [processes, setProcesses] = useState<IProcessNoDetails[] | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const handleOpenModal = () => {
        setOpen(true);

    }
    const handleCloseModal = () => {
        setOpen(false);
    }
    const selectProcess = (id: number, name: string) => {
        setSelectedProcess({ id, name });
        setOpen(false);
    }

    const getProcesses = async () => {
        const url = `${baseUrl}/listaprocesos?detalle=&id_proceso=&id_owner`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();

            if (data.exito === "SI") {
                const processesFetched = data.registros;
                setProcesses(processesFetched);
            } else {
                console.log("Ocurrió un error al consultar los procesos");
                setProcesses(null);
            }
        } catch (err) {
            console.log(err);
            setProcesses(null);
        }
    }

    useEffect(() => {
        getProcesses();
    }, [])
    return (
        <>
            {/* Modal de usaurios */}
            <Button variant="outlined" color="secondary" sx={{ p: 1.8 }} fullWidth onClick={handleOpenModal}>Seleccionar Proceso</Button>
            <Dialog onClose={handleCloseModal} open={open} fullScreen TransitionComponent={Transition} >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseModal}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Seleccionar usuario
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {processes ? processes.map((process: { id: number; name: string; }) => (
                        <Box key={process.id} sx={{ p: 2, borderRadius: "10px", border: "1px solid black", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <Typography>{process.name}</Typography>
                            <Button color="secondary" onClick={() => selectProcess(process.id, process.name)}>Seleccionar</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog>
        </>
    )
}
