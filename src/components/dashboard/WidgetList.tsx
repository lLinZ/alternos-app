import { FC } from 'react';
import { Grid, Typography, Box } from '@mui/material';
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
                : (
                    <Box sx={{ width: "100%", background: "#FFF", borderRadius: 5, p: 5 }}>
                        <Typography color="text.secondary" variant="subtitle1">No existen widgets adicionales asignados a su usuario</Typography>
                    </Box>
                )}
        </Grid>
    )
}
