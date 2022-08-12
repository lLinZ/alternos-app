import { Dispatch, FC, SetStateAction } from 'react'
import { User } from '../../interfaces/user-type'


interface Props {
    user: User;
    setUsers: Dispatch<SetStateAction<User[] | null>>
}
export const UserCard: FC<Props> = ({ user }) => {
    return (
        <div>111</div>
    )
}
