import {useState} from "react"
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    TouchSensor,
    closestCenter
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy
} from "@dnd-kit/sortable"
import Item from "./Item.tsx";
import SortableItem from "./SortableItem.tsx";
import Grid from "@mui/material/Grid";
import {Button, Stack} from "@mui/material";
import {ListEntry} from "./ListPlayground.tsx";

type DraggableGridProps = {
    start: ListEntry[]
    save: (entryId: number, position: number) => () => void
}

const DraggableGrid = ({start, save}: DraggableGridProps) => {
    const [items, setItems] = useState<ListEntry[]>(start)

    // for drag overlay
    const [activeItem, setActiveItem] = useState<ListEntry>()

    // for input methods detection
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))

    // triggered when dragging starts
    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event
        setActiveItem(items.find((item) => item.id === active.id))
    }

    // triggered when dragging ends
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event
        if (!over) return

        const activeItem = items.find((item) => item.id === active.id)
        const overItem = items.find((item) => item.id === over.id)

        if (!activeItem || !overItem) {
            return
        }

        const activeIndex = items.findIndex((item) => item.id === active.id)
        const overIndex = items.findIndex((item) => item.id === over.id)

        if (activeIndex !== overIndex) {
            setItems((prev) => arrayMove<ListEntry>(prev, activeIndex, overIndex))
        }
        setActiveItem(undefined)
    }

    const handleDragCancel = () => {
        setActiveItem(undefined)
    }

    const handleButtonClick = () => {
        items.map((item, index) => save(item.id, index+1)())
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <Grid marginBottom={2}>
                    <Grid container justifyContent="center" spacing={3}>
                        {items.map((item) => (
                            <Grid item key={item.id}><SortableItem renderAlbumCard={item.item} key={item.id}
                                                                   itemId={item.id}/></Grid>
                        ))}
                    </Grid>
                </Grid>
                <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                    <Button variant='outlined' onClick={handleButtonClick}
                            color='secondary'>Save this order</Button>
                </Stack>
            </SortableContext>
            <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
                {activeItem ? <Item renderAlbumCard={activeItem.item} isDragging/> : null}
            </DragOverlay>
        </DndContext>
    )
}

export default DraggableGrid