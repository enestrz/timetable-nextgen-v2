// This is a simplified version of the multiple sortable containers example from https://dndkit.com/examples/sortable/multiple-containers
// It uses React and TypeScript to create a drag and drop interface with four containers
// Each container can accept items from any other container and sort them vertically
// The items are simple div elements with some text

"use client";

import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Define the type of an item
type Item = {
    id: string;
    text: string;
};

// Define the initial items for each container
const initialItems: Record<string, Item[]> = {
    todo: [
        { id: "1", text: "Item 1" },
        { id: "2", text: "Item 2" },
        { id: "3", text: "Item 3" },
    ],
    inProgress: [
        { id: "4", text: "Item 4" },
        { id: "5", text: "Item 5" },
    ],
    done: [
        { id: "6", text: "Item 6" },
        { id: "7", text: "Item 7" },
    ],
    unassigned: [
        { id: "8", text: "Item 8" },
        { id: "9", text: "Item 9" },
        { id: "10", text: "Item 10" },
    ],
};

// Define the ids of the containers
const containerIds = Object.keys(initialItems) as Array<
    keyof typeof initialItems
>;

// Define a component for each item
const SortableItem: React.FC<{ item: Item; parentId: string }> = ({
    item,
    parentId,
}) => {
    // Use the useSortable hook to get the attributes and listeners for the item
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id, data: { parentId: parentId } });

    // Define the style for the item
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: "1px solid black",
        padding: "10px",
        margin: "10px",
        backgroundColor: "white",
    };

    // Return a div element with the item text
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {item.text}
        </div>
    );
};

// Define a component for each container
const SortableContainer: React.FC<{ id: string; items: Item[] }> = ({
    id,
    items,
}) => {
    // Use the useDroppable hook to get the attributes and listeners for the container
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    // Define the style for the container
    const style = {
        backgroundColor: isOver ? "lightblue" : "lightgray",
        width: "200px",
        height: "300px",
        margin: "20px",
        overflow: "auto",
    };

    // Return a div element with the container id and the sortable items
    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            <h3>{id}</h3>
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item) => (
                    <SortableItem
                        parentId={id}
                        key={item.id}
                        item={item}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

// Define the main component for the app
const App: React.FC = () => {
    // Use state to store the items for each container
    const [items, setItems] = useState(initialItems);

    // Use sensors to handle different input methods
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Define a handler for the drag end event
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        // If the item was dropped in a different container, move it there
        if (active.id !== over.id) {
            // Get the source and destination container ids
            console.log("active", active);
            console.log("over", over);
            const sourceContainerId = active.data.current?.parentId;
            const destinationContainerId = over.data.current?.parentId;

            // Get the source and destination container items
            const sourceItems = items[sourceContainerId];
            const destinationItems = items[destinationContainerId];

            // Get the source and destination index
            const sourceIndex = sourceItems.findIndex(
                (item) => item.id === active.id
            );

            console.log("destinationItems", destinationItems);
            console.log("over.id", over.id);
            const destinationIndex = destinationItems.findIndex(
                (item) => item.id === over.id
            );

            // Move the item from the source to the destination
            setItems({
                ...items,
                [sourceContainerId]: [
                    ...sourceItems.slice(0, sourceIndex),
                    ...sourceItems.slice(sourceIndex + 1),
                ],
                [destinationContainerId]: arrayMove(
                    destinationItems,
                    destinationIndex,
                    destinationIndex >= 0
                        ? destinationIndex
                        : destinationItems.length
                ),
            });
        }
    };

    // Return a div element with the DndContext and the sortable containers
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {containerIds.map((id) => (
                    <SortableContainer
                        key={id}
                        id={id}
                        items={items[id]}
                    />
                ))}
            </DndContext>
        </div>
    );
};

export default App;
