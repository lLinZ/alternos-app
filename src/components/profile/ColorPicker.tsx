import { Dispatch, FC, SetStateAction } from 'react'
import { Box, IconButton } from '@mui/material'
import { amber, orange, red, pink, purple, blue, green } from '@mui/material/colors'
interface Props {
    setColor: Dispatch<SetStateAction<string>>
}
export const ColorPicker: FC<Props> = ({ setColor }) => {
    return (
        <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
            <Box>
                <IconButton onClick={() => setColor(amber[500])} >
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: amber[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(orange[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: orange[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(red[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: red[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(pink[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: pink[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(purple[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: purple[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(blue[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: blue[500] }}></Box>
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={() => setColor(green[500])}>
                    <Box sx={{ width: 15, height: 15, borderRadius: "100%", bgcolor: green[500] }}></Box>
                </IconButton>
            </Box>
        </Box>
    )
}
