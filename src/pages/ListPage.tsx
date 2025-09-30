import { useLocation, useParams } from "react-router";
import CreateListDialog from "../components/dialogs/CreateListDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteList, fetchListsByBoardId } from "../apis/listApi";
import type { List } from "../interfaces/list.model";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// import { MdModeEdit } from "react-icons/md";
import { MdDelete, MdModeEdit } from "react-icons/md";
import YesNoDialog from "../components/dialogs/YesNoDialog";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function ListPage() {
    const { id } = useParams();
    const location = useLocation();
    const { title, description } = location.state || { title: 'Board', description: '' };
    const queryClient = useQueryClient();
    // const [edit, setEdit] = useState<boolean>(false);
    const [editList, setEditList] = useState<List | null>(null);
    
    const queryList = useQuery({
        queryKey: ['lists', id],
        queryFn: () => fetchListsByBoardId(id as string)
    });

    const deleteListMutation = useMutation({
        mutationFn: (listId: string) => { return deleteList(listId); },
        onSuccess: () => {
            invalidateLists();
            toast.success("List deleted successfully", { duration: 2000, position: 'top-right' });
        }
    });

    // const editListMutation = useMutation({
    //     mutationFn: (data: List) => {return updateList(data);},
    //     onSuccess: () => { invalidateLists(); }
    // });

    const invalidateLists = () => {
        queryClient.invalidateQueries({ queryKey: ['lists', id] });
    }
    

    return (
        <div className="container mx-auto p-4 h-screen">
            <div className="flex gap-x-10 items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <CreateListDialog
                    onSave={(res) => {
                        console.log("res received from dialog is -> ", res);
                        invalidateLists();
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
                    ) : (queryList.data?.map((list: List) => (
                    <Card key={list._id} className="min-w-[300px]">
                        <CardHeader className="border-b">
                            <CardTitle>
                                {editList && editList._id === list._id ? <Input className="ml-2" value={editList.title} /> : list.title}
                            </CardTitle>
                            <CardDescription>
                                {editList && editList._id === list._id ? <Input className="ml-2" value={editList.description} /> : list.description}
                            </CardDescription>
                            {(editList && editList._id === list._id) && (
                                <div className="ml-2 mt-2 flex gap-x-2 justify-end">
                                    <Button variant="outline" className="cursor-pointer" onClick={() => setEditList(null)}>Cancel</Button>
                                    <Button className="mr-2 cursor-pointer" onClick={() => setEditList(null)}>Save</Button>
                                </div>
                            )}
                            {
                                (!editList || editList._id !== list._id) && (
                                    <CardAction className="flex gap-x-3">
                                        <div>
                                            <button onClick={() => setEditList(list)}>
                                                <MdModeEdit className="cursor-pointer text-blue-500" />
                                            </button>
                                        </div>
                                        <div>
                                            <YesNoDialog
                                                title="Delete List"
                                                description={`Are you sure you want to delete the list "${list.title}"? This action cannot be undone.`}
                                                onYes={() => deleteListMutation.mutate(list._id as string)}
                                                onNo={() => {}}
                                                variant="destructive"
                                            >
                                                <button>
                                                    <MdDelete className="cursor-pointer text-red-500" />
                                                </button>
                                            </YesNoDialog>
                                        </div>
                                    </CardAction>
                                )
                            }
                        </CardHeader>
                    </Card>
                )))
                }
            </div>
        </div>
    );
}

export default ListPage;