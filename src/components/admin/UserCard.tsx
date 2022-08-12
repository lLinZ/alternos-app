import { Box, Card, CardActions, CardContent, Button, Typography, Collapse, IconButton, IconButtonProps, styled, Divider, Tooltip } from '@mui/material';
import { useState, Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CheckIcon from '@mui/icons-material/Check';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabledRounded';
import PersonOffIcon from '@mui/icons-material/PersonOff';

type CardProps = {
    subtitleOver: string;
    title: string;
    subtitleBelow: string;
    description: string;
}
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const BasicCard: FC<CardProps> = ({ subtitleOver, title, subtitleBelow, description }) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Card variant="outlined" sx={{ maxWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {subtitleOver}
                </Typography>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {subtitleBelow}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>

            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography fontWeight={"bold"} variant="subtitle1" >Cambiar roles</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                        <Button size="small" color="secondary" sx={{ p: 1 }}>Cliente</Button>
                        <Button size="small" color="secondary" sx={{ p: 1 }}>Usuario</Button>
                        <Button size="small" color="secondary" sx={{ p: 1 }}>Invitado</Button>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography fontWeight={"bold"} variant="subtitle1" >Cambiar Status</Typography>
                    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">

                        <Tooltip title="Activar">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} title="Activar"><CheckIcon /></IconButton>
                        </Tooltip >
                        <Tooltip title="Desactivar">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} title="Desactivar"><PersonOffIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="suspender">
                            <IconButton size="small" color="secondary" sx={{ p: 1 }} title="Suspender"><HourglassDisabledIcon /></IconButton>
                        </Tooltip>
                    </Box>

                </CardContent>
            </Collapse>
        </Card>
    );
}


interface Props {
    user: User;
    setUsers: Dispatch<SetStateAction<User[] | null>>
}
export const UserCard: FC<Props> = ({ user, setUsers }) => {
    return (<>
        <BasicCard subtitleOver={user.role_name} title={user.name} subtitleBelow={user.status} description={user.username} />
    </>
    )
}
