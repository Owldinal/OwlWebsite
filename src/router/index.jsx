import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import My from "../pages/My/index.jsx";
import Treasury from "../pages/Treasury/index.jsx";
import { merlin } from "viem/chains";
import { merlinLocal, merlinTest } from "@/config.js";
import MyItem from "@/pages/MyItem/index.jsx";
import Bind from "@/pages/Bind.jsx";

const environment = "prod";

const targetChain = merlin;
const contractAddress = environment === "test" ?
    // test
    "0x6a8a00E25A388162Bf1C495225D1046243666607" :
    // prod
    "0x6b18e87beb44a72eb48da76a881f9104cb97a180";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App contractAddress={contractAddress} targetChain={targetChain}/>,
    },
    {
        path: "/treasury",
        element: <Treasury contractAddress={contractAddress} targetChain={targetChain}/>,
    },
    {
        path: "/my",
        element: <My contractAddress={contractAddress} targetChain={targetChain}/>,
    },
    {
        path: "/bind",
        element: <Bind/>
    }
]);

export default router;
