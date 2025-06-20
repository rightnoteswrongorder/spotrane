import React, {useCallback, useEffect, useMemo, useState} from "react"
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
import {ListEntry} from "../../Lists.tsx";

type DraggableGridProps = {
    start: ListEntry[]
    save: (entryId: number, position: number) => () => void
}

const DraggableGrid = ({start = [], save}: DraggableGridProps) => {
    // Initialize with empty array but use start if available
    const [items, setItems] = useState<ListEntry[]>(start || [])
    const [activeItem, setActiveItem] = useState<ListEntry | undefined>(undefined)

    // Create sensors directly in the component (at the top level)
    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5
        }
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5
        }
    });

    const sensors = useSensors(pointerSensor, touchSensor);

    // Use a ref to track if items have been initialized
    const initializedRef = React.useRef(false);

    // Update items when start prop changes
    useEffect(() => {
        if (start && start.length > 0) {
            setItems(start);
        }
    }, [start]);

    // Memoize save order function to prevent unnecessary re-renders
    const saveOrder = useCallback(() => {
        // Only save order if items have been initialized and are not empty
        if (items.length > 0) {
            items.forEach((item, index) => {
                save(item.id, index + 1)();
            });
        }
    }, [items, save]);

    useEffect(() => {
        // Only run saveOrder if items have changed after initialization
        if (initializedRef.current) {
            saveOrder();
        } else if (items.length > 0) {
            initializedRef.current = true;
        }
    }, [items, saveOrder]);

    // Sensors created at the top level of the component

    // Memoize drag handlers to prevent recreation on each render
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const {active} = event
        if (items.length > 0) {
            const foundItem = items.find((item) => item.id === active.id);
            if (foundItem) {
                setActiveItem(foundItem);
            }
        }
    }, [items]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event
        if (!over || items.length === 0) return

        try {
            const activeIndex = items.findIndex((item) => item.id === active.id);
            const overIndex = items.findIndex((item) => item.id === over.id);

            // Check all conditions at once for better readability
            if (activeIndex !== overIndex && activeIndex >= 0 && overIndex >= 0) {
                setItems((prev) => arrayMove<ListEntry>(prev, activeIndex, overIndex));
            }
        } catch (error) {
            console.error('Error during drag end operation:', error);
        } finally {
            setActiveItem(undefined);
        }
    }, [items]);

    const handleDragCancel = useCallback(() => {
        setActiveItem(undefined)
    }, []);

    // Memoize grid items to prevent unnecessary re-renders
    const gridItems = useMemo(() => {
        if (!items || items.length === 0) return [];

        return items.map((item) => (
            <Grid item key={item.id}>
                <SortableItem 
                    albums={start} 
                    item={item} 
                    itemId={item.id}
                />
            </Grid>
        ));
    }, [items, start]);

    // Safe check for items before rendering
    const safeItems = items || [];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={safeItems} strategy={rectSortingStrategy}>
                <Grid marginBottom={2}>
                    <Grid container justifyContent="center" spacing={3}>
                        {gridItems}
                    </Grid>
                </Grid>
            </SortableContext>
            <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
                {activeItem && start ? (
                    <Item 
                        albums={start} 
                        item={activeItem} 
                        isDragging
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

export default DraggableGrid