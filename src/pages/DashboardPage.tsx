import { Box } from '@mui/material'
import { FC } from 'react'
import { WidgetList } from '../components/dashboard'
import { Layout } from '../components/layout'

interface Props {

}
const widgets = [
    {
        id: 1,
        name: "Widget 1"
    },
    {
        id: 2,
        name: "Widget 2"
    },
    {
        id: 3,
        name: "Widget 3"
    },
    {
        id: 4,
        name: "Widget 4"
    },
    {
        id: 5,
        name: "Widget 5"
    },
    {
        id: 6,
        name: "Widget 6"
    },
]
export const DashboardPage: FC<Props> = () => {
    return (

        <Layout title="Dashboard">
            <Box sx={{ width: "80%", m: "auto" }}>
                <WidgetList widgets={widgets} />
            </Box>
        </Layout>
    )
}
