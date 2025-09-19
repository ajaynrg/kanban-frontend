import { useQuery } from "@tanstack/react-query";
import { fetchAllBoards } from "../apis/boardApi";
import type { Board } from "../interfaces/board.model";

function BoardPage(){
    const {isPending, data, error, isError} = useQuery({
        queryKey:['boards'],
        queryFn:fetchAllBoards
    });

    if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((board: Board) => (
        <li key={board._id}>{board.title}</li>
      ))}
    </ul>
  )
}

export default BoardPage;