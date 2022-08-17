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
    console.log({ users })
    return (
        <Box sx={{ width: "80%", margin: "20px auto", minHeight: "100vh" }}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3, xl: 4 }} spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: "center" }}>
                {users && users.map(user => <UserCard user={user} setUsers={setUsers} users={users} key={user.id} />)}
                {!users && (<Box sx={{ mt: 2 }}><Typography variant="body2" color="text.secondary" >No existen usuarios pendientes</Typography></Box>)}
            </Masonry>
        </Box>
    )
}
