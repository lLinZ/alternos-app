// import { Masonry } from '@mui/lab'
import { Box, Typography } from '@mui/material';
import React, { Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'
import { UserCard } from './UserCard'

interface Props {
    users: User[] | null;
    setUsers: Dispatch<SetStateAction<User[] | null>>
    matches: any;
}
export const UserList: FC<Props> = ({ users, setUsers, matches }) => {
    return (

        <Box sx={{ display: "flex", alignItems: "flex-start", flexFlow: "wrap", gap: 1, width: "100%", margin: "20px auto" }}>
            {users && users.map(user => <UserCard user={user} setUsers={setUsers} users={users} key={user.id} matches={matches} />)}
            {!users && (<Box sx={{ mt: 2 }}><Typography variant="body2" color="text.secondary" >No existen usuarios pendientes</Typography></Box>)}
        </Box>
    )
}
