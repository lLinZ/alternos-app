import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { User } from "../../interfaces/user-type";
import { CaracteristicaProfile } from ".";

interface Props {
    userLogged: User | null;
}
export const UserInfo: FC<Props> = ({ userLogged }) => {
    return (
        <Box sx={{ p: 2, mb: 2 }}>
            <Typography variant="overline" fontWeight="bold">Tu información de usuario</Typography>
            <CaracteristicaProfile title="Nombre">{userLogged?.name}</CaracteristicaProfile>
            <CaracteristicaProfile title="Correo">{userLogged?.username}</CaracteristicaProfile>
            <CaracteristicaProfile title="Telefono">{userLogged?.phone}</CaracteristicaProfile>
            <CaracteristicaProfile title="Rol">{userLogged?.role_name}</CaracteristicaProfile>
            <CaracteristicaProfile title="Departamento">{userLogged?.function_name}</CaracteristicaProfile>
        </Box>
    )
}