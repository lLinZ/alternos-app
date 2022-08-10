import { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import { WidgetCard } from '.';
import { Widget } from '../../interfaces/widget-type';

interface Props {
    widgets?: Widget[];
}

export const WidgetList: FC<Props> = ({ widgets }) => {
    return (
        <Grid container display="flex" justifyContent="space-evenly" alignItems="center">
            {widgets && widgets.length > 0
                ? (widgets.map(widget => (<Grid key={widget.id} item xs={12}><WidgetCard widget={widget} /></Grid>)))
                : (<Typography color="text.secondary" variant="subtitle1">No existen widgets asignados a su usuario</Typography>)}
        </Grid>
    )
}
