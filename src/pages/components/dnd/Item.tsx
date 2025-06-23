import React, {CSSProperties, forwardRef, HTMLAttributes, useMemo} from "react"
import {AlbumCard} from "../AlbumCard.tsx";
import {Box} from "@mui/material";
import {ListEntry} from "../../Lists.tsx";
import {DragHandle} from "./DragHandle";

type Props = {
    item: ListEntry
    albums: ListEntry[]
    isOpacityEnabled?: boolean
    isDragging?: boolean
    handleProps?: React.HTMLAttributes<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

const Item = forwardRef<HTMLDivElement, Props>(
    ({albums, item, isOpacityEnabled = false, isDragging = false, handleProps, ...props}, ref) => {
        const styles = useMemo<CSSProperties>(() => ({
            opacity: isOpacityEnabled ? "0.4" : "1",
            position: 'relative',
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
            transition: 'transform 0.2s, opacity 0.2s',
            // Add these properties to prevent text selection
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation' // Improves touch handling
        }), [isOpacityEnabled, isDragging]);

        const boxShadowStyle = useMemo(() => ({
            boxShadow: isDragging ? 0 : 2,
            // Also add to the inner box to ensure complete coverage
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none'
        }), [isDragging]);

        return (
            <Box ref={ref} sx={styles} {...props}>
                <div {...handleProps}>
                    <DragHandle />
                </div>
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