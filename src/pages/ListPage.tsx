import { useLocation, useParams } from "react-router";
import CreateListDialog from "../components/dialogs/CreateListDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteList, fetchListsByBoardId, updateList } from "../apis/listApi";
import { moveCard } from "../apis/cardApi";
import type { IList } from "../interfaces/list.model";
import type { ICard } from "../interfaces/card.model";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import YesNoDialog from "../components/dialogs/YesNoDialog";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import CreateCardDialog from "../components/dialogs/CreateCardDialog";
import CardComponent from "../components/CardComponent";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { DndContext, useDroppable, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";

function ListPage() {
    const { id } = useParams();
    const location = useLocation();
    const { title, description } = location.state || { title: 'Board', description: '' };
    const queryClient = useQueryClient();
    // const [edit, setEdit] = useState<boolean>(false);
    const [editList, setEditList] = useState<IList | null>(null);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);

    const queryList = useQuery({
        queryKey: ['lists', id],
        queryFn: () => fetchListsByBoardId(id as string)
    });

    const deleteListMutation = useMutation({
        mutationFn: (listId: string) => { return deleteList(listId); },
        onSuccess: () => {
            invalidateLists(id as string);
            toast.success("List deleted successfully", { duration: 2000, position: 'top-right' });
        }
    });

    const editListMutation = useMutation({
        mutationFn: (data: IList) => {return updateList(data);},
        onSuccess: () => { invalidateLists(id as string); }
    });

    const moveCardMutation = useMutation({
        mutationFn: ({ cardId, newListId }: { cardId: string, newListId: string }) => moveCard(cardId, newListId),
        onSuccess: () => {
            invalidateLists(id as string);
            toast.success("Card moved successfully", { duration: 2000, position: 'top-right' });
        },
        onError: () => {
            toast.error("Failed to move card", { duration: 2000, position: 'top-right' });
        }
    });

    const invalidateLists = (id:string) => {
        queryClient.invalidateQueries({ queryKey: ['lists', id] });
    }

    const handleDragStart = (event: DragStartEvent) => {
        const draggedCard = event.active.data.current?.card as ICard;
        setActiveCard(draggedCard);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        // Clear the active card
        setActiveCard(null);
        
        if (!over) return;

        const draggedCard = active.data.current?.card as ICard;
        const targetListId = over.id as string;

        // If the card is being dropped in the same list, do nothing
        if (draggedCard.listId === targetListId) return;

        // Update the card with the new list ID
        const updatedCard = { ...draggedCard, listId: targetListId };
        moveCardMutation.mutate({ cardId: updatedCard._id as string, newListId: targetListId });
    };

    // Component for making each list droppable
    function ListDroppable({ listId, children }: { listId: string, children: React.ReactNode }) {
        const { isOver, setNodeRef } = useDroppable({
            id: listId
        });

        return (
            <div ref={setNodeRef} className={`min-h-[60vh] ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}`}>
                {children}
            </div>
        );
    }
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="container mx-auto p-4 h-screen">
                <div className="flex gap-x-10 items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                    <CreateListDialog
                        onSave={(res) => {
                            console.log("res received from dialog is -> ", res);
                            invalidateLists(id as string);
                        }}
                        boardId={id as string}  // id will always be present here
                    />
                </div>
                <div className="flex gap-4 overflow-x-auto h-[80vh]">
                {
                    queryList.isLoading ? (
                        <p>Loading lists...</p>
                    ) : queryList.isError ? (
                        <p>Error loading lists.</p>
                    ) : queryList.data.length === 0 ? (
                        <p>No lists found. Create one!</p>
                    ) : (queryList.data?.map((list: IList) => (
                    <Card key={list._id} className="min-w-[300px]">
                        <CardHeader className="border-b">
                            <CardTitle>
                                {
                                    editList && editList._id === list._id ? 
                                    <Input 
                                        className={`${editList.title.trim() === "" ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={editList.title} onChange={(e) => setEditList({ ...editList, title: e.target.value })} 
                                    /> 
                                    : list.title
                                }
                            </CardTitle>
                            <CardDescription>
                                {
                                    editList && editList._id === list._id ? 
                                    <Input value={editList.description} onChange={(e) => setEditList({ ...editList, description: e.target.value })} />
                                    : list.description
                                }
                            </CardDescription>
                            {(editList && editList._id === list._id) && (
                                <div className="flex justify-end gap-x-2 mt-1 -mr-2">
                                    <Button variant="outline" className="cursor-pointer" onClick={() => setEditList(null)}>Cancel</Button>
                                    <Button className="mr-2 cursor-pointer" onClick={() =>{
                                        if(editList.title.trim() === ""){
                                            toast.error("Title cannot be empty", {duration: 2000, position: 'top-right'});
                                            return;
                                        }
                                        editListMutation.mutate(editList);
                                        setEditList(null);
                                    }}>Save</Button>
                                </div>
                            )}
                            {
                                (!editList || editList._id !== list._id) && (
                                    <CardAction className="flex">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger className="outline-none -mt-3">
                                                <button
                                                    className="cursor-pointer font-semibold outline-none"
                                                >
                                                    •••
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setEditList(list)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <YesNoDialog
                                                    title="Delete List"
                                                    description={`Are you sure you want to delete the list "${list.title}"? This action cannot be undone.`}
                                                    onYes={() => deleteListMutation.mutate(list._id as string)}
                                                    onNo={() => {}}
                                                    variant="destructive"
                                                >
                                                    <DropdownMenuItem 
                                                        onSelect={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        className="cursor-pointer text-red-600 hover:text-red-800 focus:text-red-800">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </YesNoDialog>
                                                
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardAction>
                                )
                            }
                        </CardHeader>
                        <CardContent className="max-h-[60vh] overflow-y-auto">
                            <CreateCardDialog
                                onSave={(res) => {
                                    console.log("res received from dialog is -> ", res);
                                    invalidateLists(list._id as string);
                                }}
                                listId={list._id as string}  // id will always be present here
                            />
                            <ListDroppable listId={list._id as string}>
                                <div>
                                    {
                                        list.cards && list.cards.length > 0 ? list.cards.map((card) => (
                                            <CardComponent 
                                                key={card._id} 
                                                cardData={card} 
                                                onDelete={() => invalidateLists(id as string)}
                                            />
                                        )) : <p className="text-sm text-muted-foreground">No cards in this list. Add one!</p>
                                    }
                                </div>
                            </ListDroppable>
                        </CardContent>
                    </Card>
                )))
                }
                </div>
            </div>
            <DragOverlay>
                {activeCard && (
                    <CardComponent 
                        cardData={activeCard} 
                        onDelete={() => {}} // Disable delete during drag
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}

export default ListPage;