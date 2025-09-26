import { useParams } from "react-router";
// import { IoMdArrowBack } from "react-icons/io";

function DashboardPage() {
    const { id } = useParams();
    console.log("Dashboard ID:", id);
    // const navigate = useNavigate();

    return ( 
        <div className="">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
                {/* <IoMdArrowBack 
                    onClick={() => navigate(-1)}
                    className="text-xl cursor-pointer hover:text-gray-600 transition-colors" 
                /> */}
                Dashboard
            </h1>
        </div> 
    );
}

export default DashboardPage;