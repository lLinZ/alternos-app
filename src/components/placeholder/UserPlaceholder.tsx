import { FC } from "react"
import ContentLoader from "react-content-loader"

export const UserPlaceholder: FC = (props: any) => (
    <ContentLoader
        speed={1.5}
        width={185}
        height={100}
        viewBox="0 0 185 100"
        backgroundColor="#c9c9c9"
        foregroundColor="#f5f5f5"
        {...props}
    >
        <rect x="0" y="54" rx="3" ry="3" width="150" height="10" />
        <circle cx="91" cy="25" r="23" />
        <rect x="0" y="73" rx="3" ry="3" width="150" height="10" />
        <rect x="0" y="94" rx="3" ry="3" width="150" height="10" />
    </ContentLoader>
)