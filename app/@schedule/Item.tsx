import { ItemType } from "@/utils/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties, useId } from "react";
import { CSS } from "@dnd-kit/utilities";

interface ItemProps {
    item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => {
    const dndId = useId();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: { item: item, type: "item" },
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        backgroundColor: isDragging ? "white" : "transparent",
    };

    return (
        <li
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            aria-describedby={dndId}
            className="p-2 border border-gray-300 select-none rounded-md list-none"
        >
            {item.text}
        </li>
    );
};
export default Item;
