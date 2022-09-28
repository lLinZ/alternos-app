import { FC, forwardRef, ReactElement, Ref, useEffect, useState, Dispatch, SetStateAction } from 'react'

import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, Popover, Box, Slide } from '@mui/material'
import { Activity } from '../../interfaces/activity-type'
import { TransitionProps } from '@mui/material/transitions';
import InfoIcon from '@mui/icons-material/HelpRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Props {
    actividades: Activity[];
    selectedActivities: SelectedActivity[];
    setSelectedActivities: Dispatch<SetStateAction<SelectedActivity[] | null>>;
    orden: number;
    setOrden: Dispatch<SetStateAction<number>>;
    modalActividades: boolean;
    setModalActividades: Dispatch<SetStateAction<boolean>>;
}
interface Process {
    id: number;
    name: string;
    owner_id: number;
    owner_name: string;
    formulario: string;
}
interface SelectedProcess {
    id: number;
    name: string
}
interface SelectedActivity {
    id: number;
    name: string;
    orden: number;
}
export const ActivityModal: FC<Props> = ({ actividades, selectedActivities, setSelectedActivities, orden, setOrden, setModalActividades, modalActividades }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const selectActivity = (id: number, name: string) => {
        const exists = Boolean(selectedActivities?.filter(act => act.id === id).length)
        const newActivities = exists
            ? (selectedActivities?.filter(act => act.id !== id))
            : (selectedActivities ? [...selectedActivities, { id, name, orden: orden + 1 }] : [{ id, name, orden: orden + 1 }]);

        setSelectedActivities(newActivities!);
        exists ? setOrden(orden - 1) : setOrden(orden + 1);
    }
    return (
        <Dialog onClose={() => setModalActividades(false)} fullScreen open={modalActividades} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                        <InfoIcon color="info" />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Seleccionar Actividades
                    </Typography>
                    <Button
                        color="success"
                        variant="outlined"
                        onClick={() => setModalActividades(false)}
                        size="small"
                    >
                        Guardar
                    </Button>
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Box sx={{ p: 2 }}>
                            <Typography sx={{ p: 1, textAlign: "justify" }}>La última actividad seleccionada tendrá color verde, indicando que puede ser deseleccionada, esto es así para mantener el orden de las actividades.
                                Puedes deseleccionar las actividades clickeando en el orden en que las seleccionaste pero de manera invertida.</Typography>
                        </Box>

                    </Popover>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: "80%", m: "20px auto" }}>
                {actividades && actividades.map((activity: Activity) => (
                    <Box key={activity.id} sx={{ p: 2, borderRadius: "10px", border: "1px solid rgba(0,0,0,0.3)", m: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="subtitle1" fontWeight={500}>{activity.name}</Typography>
                        </Box>
                        <IconButton size="small" color="secondary" onClick={() => selectActivity(activity.id, activity.name)} disabled={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length)}>
                            {Boolean(selectedActivities?.filter(act => act.id === activity.id).length) ? (<>{selectedActivities?.filter(act => act.id === activity.id)[0].orden}<CheckCircleIcon color={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length) ? "secondary" : "success"} /></>) : (<CircleIcon />)}
                        </IconButton>
                    </Box>))}
            </Box>
        </Dialog>
    )
}
