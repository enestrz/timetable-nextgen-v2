"use client";

import { itemsData, columnsData } from "@/utils/data";
import { useEffect, useMemo, useState } from "react";
import {
    DndContext,
    DragEndEvent,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    DragStartEvent,
    DragOverlay,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Column from "./Column";
import Item from "./Item";
import { ItemType } from "@/utils/types";
import { createPortal } from "react-dom";

const Schedule: React.FC = () => {
    const [activeItem, setActiveItem] = useState<ItemType | null>(null);
    const [data, setData] = useState(itemsData);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columnIds = useMemo(() => columnsData.map((column) => column.id), []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // onDragCancel={handleDragCancel}
            onDragOver={handleDragOver}
            // onDragMove={handleDragMove}
        >
            <div className="flex flex-row gap-10 w-full">
                <SortableContext items={columnIds}>
                    {columnsData.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            items={data.filter(
                                (item) => item.columnId === column.id
                            )}
                        />
                    ))}
                </SortableContext>
            </div>
            {isMounted &&
                createPortal(
                    <DragOverlay>
                        {activeItem && <Item item={activeItem} />}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveItem(null);

        const { active } = event;
        if (active.data.current?.type === "item") {
            const newActiveItem = active.data.current!.item;
            setActiveItem(newActiveItem);
            return;
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveItem(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveColumn = active.data.current?.type === "column";
        if (!isActiveColumn) return;

        // Dropping an item over an another item
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveItem = active.data.current?.type === "item";
        const isOverItem = over.data.current?.type === "item";

        if (!activeItem) return;

        // Dropping an item over an another item
        if (isActiveItem && isOverItem) {
            setData((data) => {
                const activeIndex = data.findIndex((i) => i.id === activeId);
                const overIndex = data.findIndex((i) => i.id === overId);
                console.log("DROP OVER ITEM", { activeIndex, overIndex });
                if (data[activeIndex].columnId !== data[overIndex].columnId) {
                    data[activeIndex].columnId = data[overIndex].columnId;
                    console.log("IF'in içinde ");
                    return arrayMove(data, activeIndex, overIndex - 1);
                }
                console.log("IF'in dışında ");
                return arrayMove(data, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === "column";

        // Dropping an item over a column
        if (isActiveItem && isOverColumn) {
            setData((data) => {
                const activeIndex = data.findIndex((i) => i.id === activeId);

                data[activeIndex].columnId = overId.toString();
                console.log("DROP OVER COLUMN", { activeIndex });
                return arrayMove(data, activeIndex, activeIndex);
            });
        }
    }

    function handleDragCancel() {
        setActiveItem(null);
    }
};
export default Schedule;
