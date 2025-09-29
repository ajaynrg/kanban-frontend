import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBoard, fetchAllBoards, updateBoard } from "../apis/boardApi";
import type { Board } from "../interfaces/board.model";
import { useNavigate } from "react-router";
import CreateBoardDialog from "../components/dialogs/CreateBoardDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import YesNoDialog from "../components/dialogs/YesNoDialog";


function BoardPage(){
    const {isPending, data, error, isError} = useQuery({
        queryKey:['boards'],
        queryFn:fetchAllBoards,
    });
    const deleteBoardMutation = useMutation({
      mutationFn: deleteBoard,
    });
    const updateBoardMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: { title: string; description?: string } }) => updateBoard(id, data),
    });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [edit, setEdit] = useState(false);
    const [editBoard, setEditBoard] = useState<{ title: string; description?: string } | null>(null);

    if (isPending) {
      return <span>Loading...</span>
    }

    if (isError) {
      return <span>Error: {error.message}</span>
    }

    const navigateToBoard = (boardId: string) => {
      if (!boardId){
        console.error("Board ID is undefined or null");
        return;
      };
      console.log("Navigating to board with ID:", boardId);
      navigate(`/dashboard/${boardId}`);
    }

    const handleDeleteBoard = (boardId: string) => {
      deleteBoardMutation.mutate(boardId, {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['boards'] });
          console.log("Board deleted successfully");
          toast.success("Board deleted successfully", { duration: 2000, position: 'top-right' });
        },
        onError: (error) => {
          toast.error("Error deleting board", { duration: 2000, position: 'top-right' });
          console.error("Error deleting board:", error);
        }
      });
    }

    const onEditSave = (id: string) => {
      console.log("Saving edited board:", editBoard);
      if (!editBoard || !editBoard.title) {
        toast.error("Title is required", { duration: 2000, position: 'top-right' });
        console.error("Invalid board data");
        return;
      }
      updateBoardMutation.mutate({ id, data: editBoard }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['boards'] });
          console.log("Board updated successfully");
          toast.success("Board updated successfully", { duration: 2000, position: 'top-right' });
        },
        onError: (error) => {
          toast.error("Error updating board", { duration: 2000, position: 'top-right' });
          console.error("Error updating board:", error);
        }
      });
      setEdit(false);
      setEditBoard(null);
    }

    const onEditCancel = () => {
      setEdit(false);
      setEditBoard(null);
    }

    // We can assume by this point that `isSuccess === true`
    return (
      <div className="container mx-auto p-4 h-screen">
        <div className="flex gap-x-10 items-center mb-4">
          <h1 className="text-2xl font-bold">Boards</h1>
          <CreateBoardDialog
            onSave={(res) => {
              console.log("res recieved from dialog is -> ", res);
            }}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {data && data.length > 0 ? (
            <div>
              <Table className="justify-between w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="py-2 px-4">Index</TableHead>
                    <TableHead className="py-2 px-4">Title</TableHead>
                    <TableHead className="py-2 px-4">Description</TableHead>
                    <TableHead className="py-2 px-4">Created By</TableHead>
                    <TableHead className="py-2 px-4">Created at</TableHead>
                    <TableHead className="py-2 px-4">Last Updated</TableHead>
                    <TableHead className="py-2 px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((board: Board, idx: number) => (
                    <TableRow
                      key={board._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="py-2 px-4">{idx + 1}</TableCell>
                      {edit ? (
                        <>
                            <TableCell className="py-2 px-4">
                            <Input
                              value={editBoard?.title || ''}
                              onChange={(e) => setEditBoard(prev => prev ? { ...prev, title: e.target.value } : { title: e.target.value })}
                              className={!editBoard?.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                              placeholder="Board title"
                            />
                            {/* {!editBoard?.title && <p className="text-red-500 text-sm">Title is required</p>} */}
                            </TableCell>
                          <TableCell className="py-2 px-4">
                            <Input
                              value={editBoard?.description || ''}
                              onChange={(e) => setEditBoard(prev => prev ? { ...prev, description: e.target.value } : { title: '', description: e.target.value })}
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="py-2 px-4 font-medium">
                            {board.title}
                          </TableCell>
                          <TableCell className="py-2 px-4">
                            {board.description}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="py-2 px-4">
                        {board.createdBy}
                      </TableCell>
                      <TableCell className="py-2 px-4">
                        {board.createdAt
                          ? new Date(board.createdAt).toDateString()
                          : ""}
                      </TableCell>
                      <TableCell className="py-2 px-4">
                        {board.lastUpdated
                          ? new Date(board.lastUpdated).toDateString()
                          : ""}
                      </TableCell>
                      <TableCell className="py-2 px-4">
                        {edit ? (
                          <div className="flex gap-x-2">
                            <Button
                              variant="default"
                              className="cursor-pointer"
                              onClick={() => onEditSave(board._id || "")}
                            >
                              Save
                            </Button>
                            <Button
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={onEditCancel}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button
                                variant="ghost"
                                className="cursor-pointer"
                                size="icon"
                              >
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => navigateToBoard(board._id || "")}
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEdit(true);
                                  setEditBoard({ title: board.title, description: board.description });
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <YesNoDialog
                                onYes={() => handleDeleteBoard(board._id || "")}
                                onNo={() => {}}
                                variant="destructive"
                                title="Delete Board"
                                description="Are you sure you want to delete this board?"
                              >
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </YesNoDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No boards found
            </div>
          )}
        </div>
      </div>
    );
}

export default BoardPage;