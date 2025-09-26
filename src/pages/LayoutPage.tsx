import { Outlet } from "react-router";

function LayoutPage() {
  return <div className="m-6">
    <Outlet />
  </div>;
}

export default LayoutPage;