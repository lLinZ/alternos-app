import { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import { WidgetCard } from '.';
import { Widget } from '../../interfaces/widget-type';

interface Props {
    widgets?: Widget[];
}

export const WidgetList: FC<Props> = ({ widgets }) => {
    return (
        <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="center" spacing={1} sx={{ mb: 5 }}>
            {widgets && widgets.length > 0
                ? (widgets.map(widget => (<Grid key={widget.id} item xs={12} sm={6} md={4}><WidgetCard widget={widget} /></Grid>)))
                : (<Typography color="text.secondary" variant="subtitle1">No existen widgets adicionales asignados a su usuario</Typography>)}
        </Grid>
    )
}
