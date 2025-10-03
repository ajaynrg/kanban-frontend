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
import { useState } from "react";
import { toast } from "sonner";
import { createCard } from "../../apis/cardApi";

type CreateListProps = {
    listId:string,
    onSave: (data:object)=>void
}

type CardFormInputs = {
    title: string,
    description?: string,
}

function CreateCardDialog({listId, onSave }: CreateListProps) {

    const [open, setOpen] = useState(false)
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CardFormInputs>();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newCard: CardFormInputs) => createCard({ ...newCard, listId }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            console.log("Card created successfully:", data);
            toast.success("Card created successfully", { duration: 2000, position: 'top-right' });
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Error creating list", { duration: 2000, position: 'top-right' });
            console.error("Error creating list:", error);
        },
    });

    const onSubmit: SubmitHandler<CardFormInputs> = (res) => {
        mutation.mutate(res);
        onSave(res);
        reset();
    };

    return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'default'} 
            className="py-1 h-8 cursor-pointer w-full"
            onClick={() => reset()}
        >
            + Add a Card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Card Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        {...register("title", { required: "Card title is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter card title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                    <label htmlFor="description" className="block text-sm font-medium mb-2 mt-4">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter card description (optional)"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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

export default CreateCardDialog;