import { FC } from "react"
import ContentLoader, { IContentLoaderProps } from "react-content-loader"

export const AvatarPlaceholder: FC<IContentLoaderProps> = (props) => (
    <ContentLoader
        speed={1.5}
        width={48}
        height={48}
        viewBox="0 0 55 50"
        backgroundColor="#c9c9c9"
        foregroundColor="#f5f5f5"
        {...props}
    >
        <circle cx="30" cy="25" r="23" />
    </ContentLoader>
)