import { createBrowserRouter } from "react-router-dom";
import { merlin } from "viem/chains";
import Claim from "@/Claim.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Claim targetChain={merlin}/>,
    },
]);

export default router;
