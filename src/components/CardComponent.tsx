
import type { ICard } from "../interfaces/card.model";
import { Badge } from "./ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { deleteCard } from "../apis/cardApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import YesNoDialog from "./dialogs/YesNoDialog";
import { useDraggable } from "@dnd-kit/core";

type ICardComponentProps = {
    cardData: ICard;
    onDelete?: () => void; // Optional callback for delete action
};

function CardComponent({cardData, onDelete}: ICardComponentProps) {
    const deleteCardMutation = useMutation({
        mutationFn: (cardId: string) => { return deleteCard(cardId); },
        onSuccess: () => {
            toast.success("Card deleted successfully", { duration: 2000, position: 'top-right' });
            if (onDelete) {
                console.log("Calling onDelete callback");
                onDelete(); // Call the onDelete callback if provided
            }
        }
    });

    const handleDelete = () => {
        // e.stopPropagation(); // Prevent triggering parent click events
        deleteCardMutation.mutate(cardData._id as string);
    };

    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: cardData._id as string,
        data: {
            type: 'CARD',
            card: cardData
        }
    });

    return <Card className={`w-64 mt-2 cursor-pointer hover:shadow-lg transition-shadow ${isDragging ? 'opacity-50' : ''}`}
        ref={setNodeRef}
        {...attributes}
        >
        <CardHeader>
            <div {...listeners} className="flex-1">
                <CardTitle className="font-semibold">{cardData.title}</CardTitle>
                <CardDescription>{cardData.description}</CardDescription>
            </div>
            <CardAction className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none -mt-3">
                        <button className="cursor-pointer font-medium">•••</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <YesNoDialog
                            title={"Confirm Deletion"}
                            description={"Are you sure you want to delete this card?"}
                            onNo={() => {}}
                            onYes={handleDelete}
                            variant="destructive"
                        >
                            <DropdownMenuItem 
                                onSelect={(event) => {
                                    event.preventDefault();
                                }} 
                                className="cursor-pointer text-red-600 hover:text-red-800 focus:text-red-800"
                            >
                                Delete
                            </DropdownMenuItem>
                        </YesNoDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardAction>
        </CardHeader>
        <CardContent {...listeners}>
            {cardData.labels && cardData.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {cardData.labels.map((label, index) => (
                        <Badge key={index} variant={"secondary"}>
                            {label}
                        </Badge>
                    ))}
                </div>
            )}
        </CardContent>
        <CardFooter {...listeners}>
            {cardData.dueDate && (
                <div className="text-sm text-gray-500">
                    Due: {new Date(cardData.dueDate).toLocaleDateString()}
                </div>
            )}
        </CardFooter>
    </Card>
}

export default CardComponent;