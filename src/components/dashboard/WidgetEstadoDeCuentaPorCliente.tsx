import { Dispatch, FC, useEffect, useState } from 'react'
import { Box, AppBar, Button, Dialog, IconButton, Toolbar, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import PaidIcon from '@mui/icons-material/AttachMoneyRounded';
import Plus from '@mui/icons-material/PriceCheckRounded';
import Minus from '@mui/icons-material/MoneyOffCsredRounded';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import blue from '@mui/material/colors/blue';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { Client } from '../../interfaces/client-type';
import { FilterBox } from '../data/FilterBox';

export interface ITransactionsResumed {
    id: number;
    user_name: string;
    debitos: number;
    creditos: number;
    balance: number;
}

export const WidgetEstadoDeCuentaPorCliente: FC = () => {
    const [MyTransactions, setMyTransactions] = useState<ITransactionsResumed>({
        id: 0,
        user_name: '',
        debitos: 0,
        creditos: 0,
        balance: 0,
    })

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const theme = useTheme();
    const router = useNavigate();

    return (
        <Box display="flex" flexDirection="column"
            sx={{
                minWidth: { xs: "100%", sm: 450 },
                maxWidth: {
                    xs: "100%",
                    sm: 450
                },
                m: 1,
                boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)',
                background: theme.palette.common.white,
                borderRadius: 5,
                overflow: "hidden",
                cursor: "pointer",
                transition: ".3s ease all",
                "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" },
                minHeight: 300,
                maxHeight: 300
            }}>
            <Box id="title" sx={{ pt: 2, pl: 2 }}>
                <Typography variant="overline" fontWeight="bold">Estado de cuenta por cliente</Typography>
            </Box>
            <Box id="content" sx={{
                p: 2, minHeight: "200px", maxHeight: "300px", overflowY: "scroll",
                '&::-webkit-scrollbar': {
                    width: '0.2em',
                    height: "10px",
                    borderRadius: "10px"
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: "none",
                    webkitBoxShadow: "none"
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    outline: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: "10px",
                    height: "10px"
                }
            }}>
                <ClientsDialog setSelectedClient={setSelectedClient} selectedClient={selectedClient} setMyTransactions={setMyTransactions} />
                <Box sx={{ p: 1, display: "flex", flexFlow: "row nowrap", alignItems: "center", justifyContent: "space-between" }}>
                    <IconButton color="info" sx={{ background: green[300], border: `2px solid ${green[500]}`, "&:hover": { background: green[500] } }}><Plus color="primary" /></IconButton>
                    <Typography variant="overline" fontWeight="bold" fontSize={12}>Débitos</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" color="success" fontSize={12} sx={{ color: green[500] }}>+{MyTransactions.debitos}</Typography>
                </Box>
                <Box sx={{ p: 1, display: "flex", flexFlow: "row nowrap", alignItems: "center", justifyContent: "space-between" }}>
                    <IconButton color="error" sx={{ background: red[300], border: `2px solid ${red[500]}`, "&:hover": { background: red[500] } }}><Minus color="primary" /></IconButton>
                    <Typography variant="overline" fontWeight="bold" fontSize={12}>Créditos</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" color="error" fontSize={12}>-{MyTransactions.creditos}</Typography>
                </Box>
                <Box sx={{ p: 1, display: "flex", flexFlow: "row nowrap", alignItems: "center", justifyContent: "space-between" }}>
                    <IconButton color="success" sx={{ background: blue[300], border: `2px solid ${blue[500]}`, "&:hover": { background: blue[500] } }}><PaidIcon color="primary" /></IconButton>
                    <Typography variant="overline" fontWeight="bold" fontSize={12}>Balance</Typography>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: MyTransactions.balance > 0 ? green[500] : MyTransactions.balance === 0 ? "#000" : red[500] }} fontSize={12}>{MyTransactions.balance}</Typography>
                </Box>
            </Box>
        </Box >
    )
}
interface ClientsDialogProps {
    setSelectedClient: Dispatch<any>;
    selectedClient: Client | null;
    setMyTransactions: Dispatch<any>
}
const ClientsDialog: FC<ClientsDialogProps> = ({ selectedClient, setSelectedClient, setMyTransactions }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [clients, setClients] = useState<Client[] | null>(null);
    const selectClient = (client: Client) => {
        if (!client) return false;
        setOpen(false);
        setSelectedClient(client);
        getMyTransactions(client.id);
    }

    const getMyTransactions = async (userId: number) => {
        if (!userId) return false;
        const url = `${baseUrl}/resumenedocta?user_id=${userId}`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (data.exito === "SI") {
                setMyTransactions(data.registros[0]);
                console.log(data)
            } else {
                console.log("Ocurrio un error al solicitar la informacion del estado de cuenta");
                console.log({ data })
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }
    const getClients = async () => {
        const url = `${baseUrl}/listaclientes?status=activo`

        try {
            const respuesta = await fetch(url);

            const data = await respuesta.json();
            if (data.exito === "SI") {
                setClients(data.registros);
            } else {

                console.error("Error al consultar los clientes")
            }

        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getClients();
    }, [])
    return (
        <>
            <Button disableElevation size="small" color={selectedClient ? "info" : "secondary"} onClick={handleOpen} variant="contained" fullWidth sx={{ p: 1.8, borderRadius: 3, textTransform: "none" }}>{selectedClient ? selectedClient.name : "Seleccionar Cliente"}</Button>
            <Dialog fullScreen open={open} onClose={handleClose} PaperProps={{
                sx: {
                    background: "#F1F1F1"
                }
            }}>
                <AppBar elevation={0} sx={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
                    <Toolbar>
                        <IconButton edge="start"
                            color="inherit" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6">Seleccionar cliente</Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: '80%', margin: "100px auto", }}>
                    {clients && (<FilterBox data={clients} setData={setClients} category1="name" category2="phone" category3="username" />)}
                    {clients && clients.map((client) => (
                        <Box key={client.id} sx={{ display: "flex", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", p: 2, justifyContent: "space-between", alignItems: "center", background: "#FFF", borderRadius: 3, mb: 1, width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                <Typography variant="subtitle1">{client.name}</Typography>
                                <Typography variant="subtitle2">{client.phone}</Typography>
                            </Box>
                            <Button onClick={() => selectClient(client)} variant="contained" color="secondary" sx={{ p: 1.8, borderRadius: 3, textTransform: "none" }} disabled={selectedClient?.id === client.id ? true : false} disableElevation>{selectedClient?.id === client.id ? "Seleccionado" : "Seleccionar"}</Button>
                        </Box>
                    ))}

                </Box>
            </Dialog>
        </>
    )
}