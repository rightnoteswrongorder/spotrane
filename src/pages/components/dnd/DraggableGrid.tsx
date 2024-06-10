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

export type TItem = {
    id: number
    imageUrl: string
}



const defaultItems = [
    {
            id: 2,
            imageUrl: `https://picsum.photos/id/2/300/200`
    },
    {
        id: 15,
            imageUrl: `https://picsum.photos/id/15/300/200`
    },
    {
        id: 20,
            imageUrl: `https://picsum.photos/id/20/300/200`
    },
    {
        id: 24,
            imageUrl: `https://picsum.photos/id/24/300/200`
    },
    {
        id: 32,
            imageUrl: `https://picsum.photos/id/13/300/200`
    },
    {
        id: 35,
            imageUrl: `https://picsum.photos/id/48/300/200`
    },
    {
        id: 39,
            imageUrl: `https://picsum.photos/id/40/300/200`
    },
    {
        id: 8,
        imageUrl: `https://picsum.photos/id/43/300/200`
    },
    {
        id: 9,
        imageUrl: `https://picsum.photos/id/46/300/200`
    },
    {
        id: 10,
        imageUrl: `https://picsum.photos/id/52/300/200`
    },
    {
        id: 11,
        imageUrl: `https://picsum.photos/id/60/300/200`
    }
]

const DraggableGrid = () => {
    const [items, setItems] = useState<TItem[]>(defaultItems)

    // for drag overlay
    const [activeItem, setActiveItem] = useState<TItem>()

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
            setItems((prev) => arrayMove<TItem>(prev, activeIndex, overIndex))
        }
        setActiveItem(undefined)
    }

    const handleDragCancel = () => {
        setActiveItem(undefined)
    }

    const handleButtonClick = () => {
        const itemIds = items.map((item) => item.id)
        alert(itemIds)
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
                            <Grid item key={item.id}><SortableItem key={item.id} item={item}/></Grid>
                        ))}
                    </Grid>
                </Grid>
                <Stack sx={{paddingLeft: 5, paddingRight: 5}} spacing={1}>
                    <Button variant='outlined' onClick={handleButtonClick}
                            color='secondary'>Save this order</Button>
                </Stack>
            </SortableContext>
            <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
                {activeItem ? <Item item={activeItem} isDragging/> : null}
            </DragOverlay>
        </DndContext>
    )
}

export default DraggableGrid