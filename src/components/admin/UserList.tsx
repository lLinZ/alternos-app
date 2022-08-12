import { Masonry } from '@mui/lab'
import { Typography } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'
import { UserCard } from './UserCard'

interface Props {
    users: User[] | null;
    setUsers: Dispatch<SetStateAction<User[] | null>>
}
export const UserList: FC<Props> = ({ users, setUsers }) => {
    return (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={{ xs: 1, sm: 2, md: 3 }}>
            {users && users.map(user => <UserCard user={user} setUsers={setUsers} />)}
            {!users && (<Typography variant="body2" color="text.secondary">No existen usuarios pendientes</Typography>)}

        </Masonry>
    )
}
