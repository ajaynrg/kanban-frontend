import type { List } from "./list.model";

export interface Board{
    _id?: string;
    title: string;
    lists?: List[];
}