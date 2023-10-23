import React, { FC, useEffect, useState } from 'react'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { User } from '../../interfaces/user-type';
import PaidIcon from '@mui/icons-material/AttachMoneyRounded';
import Plus from '@mui/icons-material/PriceCheckRounded';
import Minus from '@mui/icons-material/MoneyOffCsredRounded';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import blue from '@mui/material/colors/blue';
export interface ITransactionsResumed {
    id: number;
    user_name: string;
    debitos: number;
    creditos: number;
    balance: number;
}

interface Props {
    user: User | null;
}
export const WidgetEstadoDeCuenta: FC<Props> = ({ user }) => {
    const [MyTransactions, setMyTransactions] = useState<ITransactionsResumed>({
        id: 0,
        user_name: '',
        debitos: 0,
        creditos: 0,
        balance: 0,
    })
    const theme = useTheme();
    const router = useNavigate();
    useEffect(() => {
        if (user) {
            getMyTransactions();
        }
    }, [user]);

    const getMyTransactions = async () => {
        if (!user) return false;
        const url = `${baseUrl}/resumenedocta?user_id=${user.id}`;
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

    return (
        <Box display="flex" flexDirection="column" sx={{ minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, m: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)', background: theme.palette.common.white, borderRadius: 5, overflow: "hidden", cursor: "pointer", transition: ".3s ease all", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, minHeight: 300, maxHeight: 300 }}
            onClick={() => router("/users/estadocuenta")}
        >
            <Box id="title" sx={{ pt: 2, pl: 2 }}>
                <Typography variant="overline" fontWeight="bold">Estado de cuenta {MyTransactions.user_name}</Typography>
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
        </Box>
    )
}
