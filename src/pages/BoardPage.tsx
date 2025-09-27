import { useQuery } from "@tanstack/react-query";
import { fetchAllBoards } from "../apis/boardApi";
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


function BoardPage(){
    const {isPending, data, error, isError} = useQuery({
        queryKey:['boards'],
        queryFn:fetchAllBoards,
    });
    const navigate = useNavigate();

    const navigateToBoard = (boardId: string) => {
      if (!boardId){
        console.error("Board ID is undefined or null");
        return;
      };
      navigate(`/dashboard/${boardId}`);
    }

    if (isPending) {
      return <span>Loading...</span>
    }

    if (isError) {
      return <span>Error: {error.message}</span>
    }

    // We can assume by this point that `isSuccess === true`
    return (
      <div>
        <div className="flex gap-x-10 items-center mb-4">
          <h1 className="text-2xl font-bold">Boards</h1>
          <CreateBoardDialog
            onSave={(res)=>{console.log('res recieved from dialog is -> ',res)}}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {
            data && data.length > 0 ? (
              <div>
                <Table className="justify-between w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="py-2 px-4">Index</TableHead>
                      <TableHead className="py-2 px-4">Title</TableHead>
                      <TableHead className="py-2 px-4">Created By</TableHead>
                      <TableHead className="py-2 px-4">Created at</TableHead>
                      <TableHead className="py-2 px-4">Last Updated</TableHead>
                      <TableHead className="py-2 px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      data.map((board: Board, idx: number) => (
                        <TableRow
                          key={board._id}
                          onClick={() => navigateToBoard(board._id || '')}
                          className="hover:bg-gray-50 transition"
                              >
                          <TableCell className="py-2 px-4">{idx + 1}</TableCell>
                          <TableCell className="py-2 px-4 font-medium">{board.title}</TableCell>
                          <TableCell className="py-2 px-4">{board.createdBy}</TableCell>
                          <TableCell className="py-2 px-4">{board.createdAt ? new Date(board.createdAt).toLocaleString() : ''}</TableCell>
                          <TableCell className="py-2 px-4">{board.lastUpdated ? new Date(board.lastUpdated).toLocaleString() : ''}</TableCell>
                          <TableCell className="py-2 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button variant="ghost" className="cursor-pointer" size="icon">•••</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No boards found</div>
            )
          }
        </div>
      </div>
    )
}

export default BoardPage;