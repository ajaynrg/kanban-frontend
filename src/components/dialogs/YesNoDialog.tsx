import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";

type DialogProps={
    children: React.ReactNode;
    onYes: ()=>void;
    onNo?: ()=>void;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
}

function YesNoDialog({children, onYes, onNo, title, description, variant}: DialogProps) {

    const variantClass = variant === "destructive" ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300" : "";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onYes} className={`cursor-pointer ${variantClass}`}>Continue</AlertDialogAction>
          <AlertDialogCancel onClick={onNo} className="cursor-pointer">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default YesNoDialog;
