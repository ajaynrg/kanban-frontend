import type { Card } from "./card.model";

export interface List{
    _id?: string;
    title: string;
    boardId: string;
    cards?: Card[];
}