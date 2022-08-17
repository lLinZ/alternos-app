import { FC, useState } from "react";

import { Box } from "@mui/material";

import { Layout } from "../components/layout"

interface Props {

}
export const ActividadesPage: FC<Props> = () => {
    const [userLogged, setUserLogged] = useState();

    return (
        <Layout>
            <Box sx={{ width: "80%", m: "auto" }}>
                Actividades page
            </Box>
        </Layout>
    )
}
