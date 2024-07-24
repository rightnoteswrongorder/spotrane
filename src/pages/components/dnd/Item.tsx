import {CSSProperties, forwardRef, HTMLAttributes} from "react"
import {AlbumCard} from "../AlbumCard.tsx";
import {Box} from "@mui/material";
import {ListEntry} from "../../Lists.tsx";

type Props = {
    item: ListEntry
    albums: ListEntry[]
    isOpacityEnabled?: boolean
    isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>


const Item = forwardRef<HTMLDivElement, Props>(
    ({albums, item, isOpacityEnabled, isDragging, ...props}, ref) => {
        const styles: CSSProperties = {
            opacity: isOpacityEnabled ? "0.4" : "1",
            cursor: isDragging ? "grabbing" : "grab",
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
        }

        return (
            <Box ref={ref} sx={styles} {...props}>
                <Box sx={{boxShadow: isDragging ? 0 : 2}}>
                    <AlbumCard albumCardView={item.item}
                               albums={albums}
                               addToList={item.addToList}
                               deleteAlbumFromList={item.deleteFromList}
                               updateRating={item.updateRating}/>
                </Box>
            </Box>
        )
    }
)

export default Item
