import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Item from "./Item"
import {HTMLAttributes} from "react"
import {ListEntry} from "../../Lists.tsx";

type Props = {
    item: ListEntry
    albums: ListEntry[]
    itemId: number
} & HTMLAttributes<HTMLDivElement>

const SortableItem = ({ albums, itemId, item, ...props }: Props) => {

    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: itemId,
    })

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    }

    return (
        <Item
            albums={albums}
            item={item}
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
