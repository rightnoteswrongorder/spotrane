import {CSSProperties, forwardRef, HTMLAttributes, ReactElement} from "react"
import {AlbumCardProps} from "../AlbumCard.tsx";
import {Box} from "@mui/material";

type Props = {
    renderAlbumCard: () => ReactElement<AlbumCardProps>
    isOpacityEnabled?: boolean
    isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>


const Item = forwardRef<HTMLDivElement, Props>(
    ({renderAlbumCard,  isOpacityEnabled, isDragging, ...props}, ref) => {
        const styles: CSSProperties = {
            opacity: isOpacityEnabled ? "0.4" : "1",
            cursor: isDragging ? "grabbing" : "grab",
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
        }

        const album = renderAlbumCard()

        return (
            <Box ref={ref} sx={styles} {...props}>
                <Box sx={{boxShadow: isDragging ? 0 : 2}}>
                    {album}
                </Box>
            </Box>
        )
    }
)

export default Item
