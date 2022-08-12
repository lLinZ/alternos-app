import { Masonry } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { UserList } from '../components/admin/UserList';
import { Layout } from '../components/layout';
import { User } from '../interfaces/user-type';


export const AdminPage: FC = () => {

    // Usuarios
    const [users, setUsers] = useState<User[] | null>(null);

    // Render
    return (
        <Layout title="Administradores">
            <Box sx={{ width: "100%" }}>
                <Typography variant="body1">Ver usuarios registrados</Typography>
                <UserList users={users} setUsers={setUsers} />
            </Box>
        </Layout>
    )
}
