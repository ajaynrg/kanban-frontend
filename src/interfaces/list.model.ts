import type { ICard } from "./card.model";

export interface IList{
    _id?: string;
    title: string;
    boardId: string;
    cards?: ICard[];
    description?: string;
    createdAt?: Date;
    lastUpdated?:Date;
    createdBy?: string;
}