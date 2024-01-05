import { v4 as uuidv4 } from "uuid";
import { ColumnType, ItemType } from "./types";

export const columnsData: ColumnType[] = [
    { id: "todo", title: "Todo" },
    { id: "inProgress", title: "In Progress" },
    { id: "done", title: "Done" },
];

export const itemsData: ItemType[] = [
    { id: uuidv4(), text: "Item 1", columnId: "todo" },
    { id: uuidv4(), text: "Item 2", columnId: "inProgress" },
    { id: uuidv4(), text: "Item 3", columnId: "done" },
    { id: uuidv4(), text: "Item 4", columnId: "inProgress" },
    { id: uuidv4(), text: "Item 5", columnId: "inProgress" },
    { id: uuidv4(), text: "Item 6", columnId: "done" },
    { id: uuidv4(), text: "Item 7", columnId: "todo" },
];
