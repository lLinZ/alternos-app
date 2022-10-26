import { FC } from "react"
import ContentLoader from "react-content-loader"

export const MenuTextPlaceholder: FC = (props: any) => (
    <ContentLoader
        speed={1.5}
        width={185}
        height={100}
        viewBox="0 0 185 120"
        backgroundColor="#c9c9c9"
        foregroundColor="#f5f5f5"
        {...props}
    >
        <circle cx="10" cy="10" r="8" />
        <rect x="25" y="5" rx="5" ry="5" width="160" height="10" />
        <circle cx="10" cy="40" r="8" />
        <rect x="25" y="35" rx="5" ry="5" width="160" height="10" />
        <circle cx="10" cy="70" r="8" />
        <rect x="25" y="65" rx="5" ry="5" width="160" height="10" />
        <circle cx="10" cy="100" r="8" />
        <rect x="25" y="95" rx="5" ry="5" width="160" height="10" />
    </ContentLoader>
)