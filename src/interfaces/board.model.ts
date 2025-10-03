import type { IList } from "./list.model";

export interface IBoard{
    _id?: string;
    title: string;
    description?: string;
    createdAt?: Date;
    lastUpdated?:Date;
    createdBy?: string;
    lists?: IList[];
}