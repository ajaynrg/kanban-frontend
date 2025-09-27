import type { List } from "./list.model";

export interface Board{
    _id?: string;
    title: string;
    description?: string;
    createdAt?: Date;
    lastUpdated?:Date;
    createdBy?: string;
    lists?: List[];
}