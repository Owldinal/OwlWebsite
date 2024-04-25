import { defineChain } from "viem";
import Owldinal from "./abi/Owldinal.json";
import OwldinalGenOneBox from "./abi/OwldinalGenOneBox.json";
import OwlGame from "./abi/OwlGame.json";
import OwlToken from "./abi/OwlToken.json";

export const coin = "Owl";

const API_URL = 'https://api.owldinal.xyz/api';

export const hKey = "b1e01052-f40d-4e26-a653-1f413767e4d4";

export const ContractAddress = {
    // prod
    owldinalNftAddress: "0x6b18e87beb44a72eb48da76a881f9104cb97a180",
    owlTokenAddress: "0x62e99191071Fc1C5947CF1e21Aa95708dcc51AdB",
    genOneBoxAddress: "0xaA5afDe31B0AaC9dc7738679Ab512830B6D087A2",
    owlGameAddress: "0x0F85ef658068Da66908d6435aA93D1f4Db8b9937",
}

export const ContractAbi = {
    owlToken: OwlToken,
    owldinalNft: Owldinal,
    owlGame: OwlGame,
    genOneBox: OwldinalGenOneBox
}

export const list = {
    GENERATE_SIGNATURE: `${API_URL}/generateSignature`,
    USER_INFO: `${API_URL}/user/info`,
    USER_OWLDINALS: `${API_URL}/user/owldinals`,
    USER_BOXES: `${API_URL}/user/boxes`,
    USER_INVITES: `${API_URL}/user/inviter`,
    GAME_INFO: `${API_URL}/game/info`,
    REWARDS_TREND: `${API_URL}/game/rewards_trend`,
    REWARDS_HISTORY: `${API_URL}/game/rewards_history`,
    MINT_HASH: `${API_URL}/user/mint_tx`,
}

export const getData = {
    getUserInfo: async (address) => {
        const request = list.USER_INFO + "?wallet=" + address;
        const response = await fetch(request);
        return await response.json();
    },
    getUserOwldinals: async (address, page, perPage) => {
        const request = list.USER_OWLDINALS + "?wallet=" + address + "&page=" + page + "&per_page=" + perPage;
        const response = await fetch(request);
        return await response.json();
    },
    getUserBoxes: async (address, page, perPage) => {
        const request = list.USER_BOXES + "?wallet=" + address + "&page=" + page + "&per_page=" + perPage;
        const response = await fetch(request);
        return await response.json();
    },
    getGameInfo: async () => {
        const request = list.GAME_INFO;
        const response = await fetch(request);
        return await response.json();
    },
    getRewardsTrend: async () => {
        const request = list.REWARDS_TREND;
        const response = await fetch(request);
        return await response.json();
    },
    getRewardsHistory: async (cursor, limit) => {
        const request = list.REWARDS_HISTORY + "?cursor=" + cursor + "&limit=" + limit;
        const response = await fetch(request);
        return await response.json();
    },
    getPriceUSD: async () => {
        const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x62e99191071Fc1C5947CF1e21Aa95708dcc51AdB")
        return await response.json()
    },
    getMintHash: async (requestHash) => {
        const request = list.MINT_HASH + "?tx=" + requestHash;
        const response = await fetch(request);
        return await response.json();
    },
}

export const merlinTest = defineChain({
    id: 686868,
    name: 'Merlin Testnet',
    nativeCurrency: {name: 'BTC', symbol: 'BTC', decimals: 18},
    rpcUrls: {
        default: {
            http: [
                'https://testnet-rpc.merlinchain.io',
                'https://merlin-testnet.blockpi.network/v1/rpc/public',
            ]
        },
    },
    blockExplorers: {
        default: {name: 'Merlin-scan', url: 'https://testnet-scan.merlinchain.io'},
    },
})

export const merlinLocal = defineChain({
    id: 1337,
    name: 'Merlin Local',
    nativeCurrency: {name: 'BTC', symbol: 'BTC', decimals: 18},
    rpcUrls: {
        default: {http: ['https://node.owldinal.xyz']},
    }
})
