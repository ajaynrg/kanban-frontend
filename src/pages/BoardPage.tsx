import { useQuery } from "@tanstack/react-query";
import { fetchAllBoards } from "../apis/boardApi";
import type { Board } from "../interfaces/board.model";
import { useNavigate } from "react-router";
import CreateBoardDialog from "../components/dialogs/CreateBoardDialog";

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          {data.map((board: Board) => (
            <div 
              key={board._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200 hover:border-blue-300"
              onClick={() => {navigateToBoard(board._id || '')}}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{board.title}</h3>
              <div className="text-sm text-gray-500">
                Click to open board
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default BoardPage;