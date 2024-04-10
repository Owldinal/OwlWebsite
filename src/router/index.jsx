import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import My from "../pages/My/index.jsx";
import Treasury from "../pages/Treasury/index.jsx";
import { merlin } from "viem/chains";
import { merlinTest } from "@/config.js";
import MyItem from "@/pages/MyItem/index.jsx";

const environment = "test";

const targetChain = environment === "test" ? merlinTest : merlin;
const contractAddress = environment === "test" ?
    // test
    "0x6a8a00E25A388162Bf1C495225D1046243666607" :
    // prod
    "0xECcD2b378567f97E5a0B6d93d944Ab9ba67d82B0";

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
        path: "/my-item",
        element: <MyItem contractAddress={contractAddress} targetChain={targetChain}/>,
    }
]);

export default router;
