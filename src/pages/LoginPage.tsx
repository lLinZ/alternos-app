import { Typography } from '@mui/material';
import { FC } from 'react';
import { Layout } from '../components/layout';
interface Props {

}
export const LoginPage: FC<Props> = () => {
    return (
        <Layout title="Iniciar sesión en Alternos">
            <Typography>
                Pagina de login
            </Typography>
        </Layout>
    )
}
