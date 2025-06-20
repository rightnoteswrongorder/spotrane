import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Item from "./Item"
import React, {HTMLAttributes, useMemo} from "react"
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

    const styles = useMemo(() => ({
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    }), [transform, transition]);

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

export default React.memo(SortableItem)
