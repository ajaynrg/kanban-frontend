import { createBrowserRouter } from "react-router";
import App from "../App";
import LayoutPage from "../pages/LayoutPage";
import BoardPage from "../pages/BoardPage";
import DashboardPage from "../pages/DashboardPage";

export const router = createBrowserRouter([
    {
      path: "/",
      Component: App,
      children: [
        { index: true, path: "/home", Component: LayoutPage},
        { path: "/boards", Component: BoardPage },
        { path: "/dashboard/:id", Component: DashboardPage },
        { path: "/teams", Component: LayoutPage },
        { path: "/calendar", Component: LayoutPage },
      ]
    },
]);