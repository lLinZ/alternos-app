import { ChangeEvent, FC, useState } from 'react'
import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material'
import { Layout } from '../components/layout'


export const DetailsPage: FC = () => {

    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    return (
        <Layout>
            <Box sx={styles.mainContainer}>
                <Typography variant="overline" fontWeight={"bold"} fontSize={16}>Registros</Typography>
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Typography variant="overline">Buscar registros por fecha</Typography>
                        <Box sx={styles.searchContainer}>

                            <Box sx={styles.fromToContainer}>
                                <TextField label="Desde" value={from} onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }} />
                                <Divider orientation='vertical' />
                                <TextField label="Hasta" value={to} onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.currentTarget.value)} color="secondary" InputProps={{ sx: { ...styles.inputSearch, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textAlign: "right" } }} />
                            </Box>
                            <Button variant="contained" color="secondary" sx={{ ...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0 }} disableElevation>Buscar</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}
const styles = {
    mainContainer: {
        minHeight: "100vh",
        width: '80%',
        margin: "20px auto"
    },
    searchContainer: {
        display: "flex",
        flexFlow: "column wrap",
        width: "100%"
    },
    inputSearch: {
        border: "none",
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: "#FFF",
        boxShadow: "0 0 2px rgba(0,0,0,0.1)",
        "& fieldset": {
            transition: "1s ease all",
            border: "none",
        },
        "&:hover > fieldset": { border: "1px solid black" },

    },
    fromToContainer: {
        display: "flex",
        flexFlow: "row nowrap"
    },
    button: {
        textTransform: "none",
        p: 2,
        borderRadius: 5
    }

}