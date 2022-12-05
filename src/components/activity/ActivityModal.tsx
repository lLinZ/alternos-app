import { FC, forwardRef, ReactElement, Ref, useState, Dispatch, SetStateAction } from 'react'

import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, Popover, Box, Slide } from '@mui/material'
import { Activity, SelectedActivity } from '../../interfaces/activity-type'
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
    actividades: Activity[] | null;
    selectedActivities: SelectedActivity[] | null;
    setSelectedActivities: Dispatch<SetStateAction<SelectedActivity[] | null>>;
    orden: number;
    setOrden: Dispatch<SetStateAction<number>>;
    modalActividades: boolean;
    setModalActividades: Dispatch<SetStateAction<boolean>>;
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
            : (selectedActivities ? [...selectedActivities, { id, name, orden: orden + 1, precedencia: 0 }] : [{ id, name, orden: orden + 1, precedencia: 0 }]);
        console.log(newActivities);
        setSelectedActivities(newActivities!);
        exists ? setOrden(orden - 1) : setOrden(orden + 1);
    }
    return (
        <Dialog onClose={() => setModalActividades(false)} fullScreen open={modalActividades} TransitionComponent={Transition} PaperProps={{ sx: { background: "rgba(255,255,255,0.9)", backdropFilter: 'blur(6px)' } }}>
            <AppBar sx={{ position: 'relative', boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(255,255,255,0.6)", }} elevation={0}>
                <Toolbar>
                    <IconButton onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                        <InfoIcon color="info" />
                    </IconButton>
                    <Typography sx={styles.title} variant="h6" component="div">
                        Seleccionar Actividades
                    </Typography>
                    <Button color="success" variant="contained" disableElevation onClick={() => setModalActividades(false)} size="small" sx={{ borderRadius: 5 }}>
                        Guardar
                    </Button>
                    <Popover id="mouse-over-popover" sx={{ pointerEvents: 'none', }} open={open} anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handlePopoverClose} disableRestoreFocus>
                        <Box sx={{ p: 2 }}>
                            <Typography sx={styles.popoverText}>{PopOverText}</Typography>
                        </Box>

                    </Popover>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: "80%", m: "20px auto" }}>
                {actividades && actividades.map((activity: Activity) => (
                    <Box key={activity.id} sx={styles.activityContainer}>
                        <Box sx={styles.activityName}>
                            <Typography variant="subtitle1">{activity.name}</Typography>
                        </Box>
                        <IconButton size="small" color="secondary" onClick={() => selectActivity(activity.id, activity.name)} disabled={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length)}>
                            {
                                Boolean(selectedActivities?.filter(act => act.id === activity.id).length)
                                    ? (<>{selectedActivities?.filter(act => act.id === activity.id)[0].orden}
                                        <CheckCircleIcon color={Boolean(selectedActivities?.filter(act => act.id === activity.id && act.orden !== orden).length) ? "secondary" : "success"} /></>)
                                    : (<CircleIcon />)
                            }
                        </IconButton>
                    </Box>))}
            </Box>
        </Dialog>
    )
}

const PopOverText = "La última actividad seleccionada tendrá color verde, indicando que puede ser deseleccionada, esto es así para mantener el orden de las actividades. Puedes deseleccionar las actividades clickeando en el orden en que las seleccionaste pero de manera invertida."

const styles = {
    title: {
        ml: 2,
        flex: 1
    },
    popoverText: {
        p: 1,
        textAlign: "justify",
    },
    activityContainer: {
        p: 3,
        borderRadius: 5,
        m: 2,
        boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)',
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    activityName: {
        display: "flex",
        flexDirection: "column"
    }
}
