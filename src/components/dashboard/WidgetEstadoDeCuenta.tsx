import { FC, useEffect, useState } from 'react'
import { Divider, Box, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../common/baseUrl';
import { getCookieValue } from '../../lib/functions';
import { User } from '../../interfaces/user-type';
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
    const [MyTransactions, setMyTransactions] = useState<ITransactionsResumed[] | null>(null)
    const theme = useTheme();
    const router = useNavigate();
    useEffect(() => {
        getMyTransactions();
    }, []);

    const getMyTransactions = async () => {
        if (!user) return false;
        const url = `${baseUrl}/resumenedocta?user_id=${user.id}`;
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.exito === "SI") {
                setMyTransactions(data.registros);
                console.log(data)
            } else {
                console.log("Ocurrio un error al solicitar la informacion de las tareas");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box display="flex" flexDirection="column" sx={{ minWidth: { xs: "100%", sm: 450 }, maxWidth: { xs: "100%", sm: 450 }, mr: 1, mb: 1, boxShadow: '0 8px 32px 0 rgba(100,100,100,0.1)', background: theme.palette.common.white, borderRadius: 5, overflow: "hidden", cursor: "pointer", transition: ".3s ease all", "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" }, minHeight: 250, maxHeight: 250 }}
            onClick={() => router("/users/estadocuenta")}
        >
            <Box id="title" sx={{ pt: 2, pl: 2 }}>
                <Typography variant="overline" fontWeight="bold">Transacciones recientes</Typography>
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
                {MyTransactions ? MyTransactions.map((trx: ITransactionsResumed) => (
                    <Box key={trx.id} sx={{ boxShadow: '0 8px 32px 0 rgba(100,100,100,0.2)', background: "rgba(200,200,200,0.2)", borderRadius: 5, p: 2, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Debitos {trx.debitos}</Typography>
                        <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Creditos {trx.creditos}</Typography>
                        <Typography variant="subtitle2" fontWeight="bold" fontSize={12}>Balance {trx.balance}</Typography>
                    </Box>
                ))
                    : <Typography variant="subtitle2" color="text.secondary">Sin transacciones</Typography>
                }
            </Box>
        </Box>
    )
}
