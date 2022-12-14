import { Masonry } from '@mui/lab'
import { Box, Typography } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'
import { UserCard } from './UserCard'

interface Props {
    users: User[] | null;
    setUsers: Dispatch<SetStateAction<User[] | null>>
}
export const UserList: FC<Props> = ({ users, setUsers }) => {
    return (
        <Box sx={{ width: "100%", margin: "20px auto", minHeight: "100vh" }}>
            {users && users.map(user => <UserCard user={user} setUsers={setUsers} users={users} key={user.id} />)}
            {!users && (<Box sx={{ mt: 2 }}><Typography variant="body2" color="text.secondary" >No existen usuarios pendientes</Typography></Box>)}
        </Box>
    )
}
