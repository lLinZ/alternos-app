import { Box } from "@mui/material"
import { FC } from "react"
import ContentLoader from "react-content-loader"

export const UserDataPlaceholder: FC = (props: any) => (
    <ContentLoader
        speed={1.5}
        width={185}
        height={80}
        viewBox="0 0 185 80"
        backgroundColor="#c9c9c9"
        foregroundColor="#f5f5f5"
        {...props}
    >
        <rect x="10" y="5" rx="5" ry="5" width="150" height="10" />
        <rect x="10" y="35" rx="5" ry="5" width="150" height="10" />
        <rect x="10" y="65" rx="5" ry="5" width="150" height="10" />
    </ContentLoader>
)