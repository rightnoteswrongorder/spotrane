import React, {CSSProperties, forwardRef, HTMLAttributes, useMemo} from "react"
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
    ({albums, item, isOpacityEnabled = false, isDragging = false, ...props}, ref) => {
        // More type-safe approach with defaults for undefined values
        const styles = useMemo<CSSProperties>(() => ({
            opacity: isOpacityEnabled ? "0.4" : "1",
            cursor: isDragging ? "grabbing" : "grab",
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
            // Add transition for smoother visual feedback
            transition: 'transform 0.2s, opacity 0.2s'
        }), [isOpacityEnabled, isDragging]);

        const boxShadowStyle = useMemo(() => ({
            boxShadow: isDragging ? 0 : 2
        }), [isDragging]);

        return (
            <Box ref={ref} sx={styles} {...props}>
                <Box sx={boxShadowStyle}>
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

export default React.memo(Item)
