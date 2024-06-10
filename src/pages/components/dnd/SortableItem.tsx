import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Item from "./Item"
import {HTMLAttributes, ReactElement} from "react"
import {AlbumCardProps} from "../AlbumCard.tsx";

type Props = {
    renderAlbumCard: () => ReactElement<AlbumCardProps>
    itemId: number
} & HTMLAttributes<HTMLDivElement>

const SortableItem = ({ itemId, renderAlbumCard, ...props }: Props) => {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: itemId,
    })

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    }

    return (
        <Item
            renderAlbumCard={renderAlbumCard}
            ref={setNodeRef}
            style={styles}
            isOpacityEnabled={isDragging}
            {...props}
            {...attributes}
            {...listeners}
        />
    )
}

export default SortableItem
