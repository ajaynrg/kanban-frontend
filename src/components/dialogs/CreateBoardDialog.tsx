import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "../../apis/boardApi";
import { useState } from "react";

type CreateDialogProps = {
    data?:object,
    onSave: (data:object)=>void
}

type BoardFormInputs = {
    title: string
}

function CreateBoardDialog({data, onSave}:CreateDialogProps) {

    const [open, setOpen] = useState(false)
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BoardFormInputs>();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createBoard,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            console.log("Board created successfully:", data);
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error creating board:", error);
        },
    });

    const onSubmit: SubmitHandler<BoardFormInputs> = (res) => {
        mutation.mutate(res);
        onSave(res);
        reset();
    };

    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'default'} variant={'secondary'} 
            className="py-1 h-8 cursor-pointer"
            onClick={() => reset()}
        >
            + Create New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Board Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Board Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        {...register("title", { required: "Board title is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter board title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-x-2">
                <Button type="submit" className="mt-6 cursor-pointer">
                    Submit
                </Button>
                <DialogClose asChild>
                    <Button variant="outline" className="mt-6 cursor-pointer">
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
      </DialogContent>
    </Dialog>;
}

export default CreateBoardDialog;