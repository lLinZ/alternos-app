import { FC } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { WidgetCard } from '.';
import { Widget } from '../../interfaces/widget-type';

interface Props {
    widgets?: Widget[];
}

export const WidgetList: FC<Props> = ({ widgets }) => {
    return (
        <>
            {widgets && widgets.length > 0
                ? (
                    <Grid container display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" alignItems="center" spacing={1}>
                        {widgets.map(widget => (<Grid key={widget.id} item xs={12} sm={6} md={4}><WidgetCard widget={widget} /></Grid>))}
                    </Grid>)
                : (
                    <Box sx={{ display: "inline-block", background: "#FFF", borderRadius: 5, p: 5, minWidth: { xs: "100%", sm: 400 }, maxWidth: { xs: "100%", sm: 400 } }}>
                        <img src="./aditional-widgets.jpg" style={{ width: 200 }} />
                        <Typography color="text.primary" variant="subtitle1" fontWeight="bold">¡Por ahora!</Typography>
                        <Typography color="text.secondary" variant="subtitle2">No existen widgets adicionales asignados a su usuario...</Typography>
                    </Box>
                )}
        </>
    )
}
