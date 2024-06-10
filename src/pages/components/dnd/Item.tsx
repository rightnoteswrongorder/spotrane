import {CSSProperties, forwardRef, HTMLAttributes} from "react"
import {TItem} from "./DraggableGrid.tsx";
import {SpotraneAlbumCard} from "../../../interfaces/spotrane.types.ts";
import {AlbumCard} from "../AlbumCard.tsx";
import {Box} from "@mui/material";

type Props = {
    item: TItem
    isOpacityEnabled?: boolean
    isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>


const createAlbumCard = (imageUri: string): SpotraneAlbumCard => {
    return {
        id: "1234",
        name: "Timeless",
        releaseDate: "01-01-1900",
        imageUri: imageUri,
        albumUri: "http://foo.png",
        label: "ECM",
        artistId: "1234",
        artistName: "John Abercrombie",
        artistGenres: ["jazz", "chamber", "european"],
        isSaved: true
    } as SpotraneAlbumCard
}

const Item = forwardRef<HTMLDivElement, Props>(
    ({item, isOpacityEnabled, isDragging, style, ...props}, ref) => {
        const styles: CSSProperties = {
            opacity: isOpacityEnabled ? "0.4" : "1",
            cursor: isDragging ? "grabbing" : "grab",
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
            ...style
        }

        return (
            <Box ref={ref} sx={styles} {...props}>
                <Box sx={{boxShadow: isDragging ? 0 : 2}}>
                    <AlbumCard albumCardView={createAlbumCard(item.imageUrl)} addToList={() => { }}/>
                </Box>
            </Box>
        )
    }
)

export default Item
