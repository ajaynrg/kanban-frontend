import { createBrowserRouter } from "react-router";
import App from "../App";
import LayoutPage from "../pages/LayoutPage";
import BoardPage from "../pages/BoardPage";

export const router = createBrowserRouter([
    {
      path: "/",
      Component: App,
      children: [
        { index: true, path: "/home", Component: LayoutPage},
        { path: "/boards", Component: BoardPage },
        { path: "/teams", Component: LayoutPage },
        { path: "/calendar", Component: LayoutPage },
      ]
    },
]);