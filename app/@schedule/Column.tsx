import { ColumnType, ItemType } from "@/utils/types";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import Item from "./Item";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColumnProps {
    column: ColumnType;
    items: ItemType[];
}

const Column: React.FC<ColumnProps> = ({ column, items }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: { type: "column", column: column },
        disabled: true,
    });

    return (
        <ul
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
                transition,
            }}
            aria-describedby={column.id}
            className="flex flex-col flex-1 p-2 gap-2 bg-gray-100"
        >
            <h2>{column.title}</h2>
            <SortableContext items={items.map((item) => item.id)}>
                {items.map((item) => (
                    <Item
                        key={item.id}
                        item={item}
                    />
                ))}
            </SortableContext>
        </ul>
    );
};

export default Column;
