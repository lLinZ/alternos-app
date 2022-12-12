import { Dialog, AppBar, Toolbar, IconButton, Typography, Box, Button, CircularProgress, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Dispatch, FC, forwardRef, ReactElement, Ref, SetStateAction, useEffect, useState } from 'react'
import { baseUrl } from '../../common/baseUrl';
import CloseIcon from '@mui/icons-material/Close';
import { ISelectedProcess, Process } from '../../interfaces/process-type';
import { CheckCircleRounded } from '@mui/icons-material';
import { FilterBox } from '../data/FilterBox';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface Props {
    buttonColor?: "primary" | "secondary";
    selectedProcess: ISelectedProcess | null;
    setSelectedProcess: Dispatch<SetStateAction<ISelectedProcess | null>>;
    setUserSelected?: Dispatch<SetStateAction<{ id: number; name: string } | null>>;
}
export const ProcessesModal: FC<Props> = ({ selectedProcess, setSelectedProcess, buttonColor = "secondary", setUserSelected }) => {
    const [processes, setProcesses] = useState<Process[] | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const handleOpenModal = () => {
        setOpen(true);

    }
    const handleCloseModal = () => {
        setOpen(false);
    }
    const selectProcess = (id: number, name: string, actividades: any[]) => {
        setSelectedProcess({ id, name, actividades });
        setOpen(false);
    }

    const getProcesses = async () => {
        setUserSelected && setUserSelected(null);
        const url = `${baseUrl}/listaprocesos?detalle=&id_proceso=&id_owner`;

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            console.log({ data })
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
            <Button color={buttonColor} sx={{ p: 1, borderRadius: 3, boxShadow: "0 0 5px rgba(0,0,0,0.1)", textTransform: "none" }} disableElevation fullWidth onClick={handleOpenModal}>Seleccionar Proceso</Button>
            <Dialog onClose={handleCloseModal} open={open} fullScreen TransitionComponent={Transition} PaperProps={{ sx: { background: "#F5F5F5" } }}>
                <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(255,255,255,0.6)", }} elevation={0}>
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
                            Seleccionar proceso
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: "80%", m: "20px auto" }}>
                    {processes && <FilterBox data={processes} setData={setProcesses} category1="name" category2="id" />}
                    {processes ? processes.map((process: any) => (
                        <Box key={process.id} sx={{
                            p: 2, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: 'blur(6px)', m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center"
                        }}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="subtitle1" fontWeight="bold">{process.name}</Typography>
                                <Typography variant="subtitle2" fontWeight={200} color="text.secondary">{process.actividades?.length} {process.actividades && process.actividades?.length > 1 ? " actividades" : " actividad"}</Typography>
                            </Box>
                            <Button color="secondary" variant="contained" onClick={() => selectProcess(process.id, process.name, process.actividades)} sx={{ p: 2, borderRadius: 5, textTransform: "none" }} disableElevation disabled={selectedProcess?.id === process.id}>{selectedProcess?.id === process.id ? 'Seleccionado' : 'Seleccionar'}{selectedProcess?.id === process.id && <CheckCircleRounded color="success" />}</Button>
                        </Box>)) : <CircularProgress color="secondary" />}
                </Box>
            </Dialog>
        </>
    )
}
