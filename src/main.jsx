import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import "@rainbow-me/rainbowkit/styles.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { merlin, sepolia } from "viem/chains";
import { RouterProvider } from 'react-router-dom';
import router from './router/index';
import { defineChain } from "viem";

export const merlinTest = defineChain({
    id: 686868,
    name: 'Merlin Testnet ',
    nativeCurrency: {name: 'BTC', symbol: 'BTC', decimals: 18},
    rpcUrls: {
        default: {http: ['https://testnet-rpc.merlinchain.io']},
    },
    blockExplorers: {
        default: {name: 'Merlin-scan', url: 'https://testnet-scan.merlinchain.io'},
    },
})

const config = getDefaultConfig({
    appName: 'Owl',
    projectId: 'ae928899b66286a771031a02c9ac00d9',
    chains: [merlin, merlinTest, sepolia],
});
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>
                    <RouterProvider router={router}/>
                    {/*<App/>*/}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
);
