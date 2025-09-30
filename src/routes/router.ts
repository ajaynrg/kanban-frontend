import { createBrowserRouter } from "react-router";
import App from "../App";
import LayoutPage from "../pages/LayoutPage";
import BoardPage from "../pages/BoardPage";
import ListPage from "../pages/ListPage";

export const router = createBrowserRouter([
    {
      path: "/",
      Component: App,
      children: [
        { path: "/", Component: BoardPage, index: true },
        { path: "/boards", Component: BoardPage },
        { path: "/lists/:id", Component: ListPage },
        { path: "/teams", Component: LayoutPage },
        { path: "/calendar", Component: LayoutPage },
      ]
    },
]);