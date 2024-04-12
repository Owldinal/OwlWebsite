import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { connectorsForWallets, darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import "@rainbow-me/rainbowkit/styles.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';
import { merlin, sepolia } from "viem/chains";
import { RouterProvider } from 'react-router-dom';
import router from './router/index';
import {
    metaMaskWallet,
    okxWallet,
    rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { merlinLocal, merlinTest } from "@/config.js";


export const config = getDefaultConfig({
    appName: 'Owl',
    projectId: 'ae928899b66286a771031a02c9ac00d9',
    chains: [merlin, merlinTest, merlinLocal],
    wallets: [{
        groupName: 'Recommended',
        wallets: [
            metaMaskWallet,
            okxWallet,
            rainbowWallet,
        ],
    }],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()} modalSize={"compact"}>
                    <RouterProvider router={router}/>
                    {/*<App/>*/}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
);
