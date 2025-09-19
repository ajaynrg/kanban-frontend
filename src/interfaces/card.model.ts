export interface Card {
    _id?: string;
    title: string;
    description?: string;
    assignee?: string;
    listId: string;
    position?: number;
    dueDate?: Date;
    labels?: string[];
}