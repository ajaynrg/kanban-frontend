import { useParams, useLocation } from "react-router";
import CreateListDialog from "../components/dialogs/CreateListDialog";
// import { IoMdArrowBack } from "react-icons/io";

function DashboardPage() {
    const { id } = useParams();
    const location = useLocation();
    const {title, description} = location.state || {};
    // const navigate = useNavigate();
    console.log("DashboardPage params:", { id });
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
                }}
                boardId={id as string}  // id will always be present here
            />
            </div>
        </div>
    );
}

export default DashboardPage;