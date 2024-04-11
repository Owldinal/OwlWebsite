import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import My from "../pages/My/index.jsx";
import MyItem from "../pages/MyItem/index.jsx";
import Treasury from "../pages/Treasury/index.jsx";
import Bind from "@/pages/Bind.jsx";


const router = createBrowserRouter([
    {

        path: "/",


        element: <App/>,
    },
    {
        path: "/treasury",

        element: <Treasury/>,
    },
    {
        path: "/my",

        element: <My/>,
    },
    {
        path: "/my-item",

        element: <MyItem/>,
    },
    {
        path: "/bind",
        element: <Bind/>
    }
]);

export default router;
