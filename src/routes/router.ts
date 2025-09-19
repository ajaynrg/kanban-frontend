import { createBrowserRouter } from "react-router";
import App from "../App";
import LayoutPage from "../pages/LayoutPage";

export const router = createBrowserRouter([
    {
      path: "/",
      Component: App,
      children: [
        { index: true, path: "/home", Component: LayoutPage},
        { path: "/boards", Component: LayoutPage },
        { path: "/teams", Component: LayoutPage },
        { path: "/calendar", Component: LayoutPage },
      ]
    },
]);