import { defineChain } from "viem";
import Owldinal from "./abi/Owldinal.json";
import OwldinalGenOneBox from "./abi/OwldinalGenOneBox.json";
import OwlGame from "./abi/OwlGame.json";
import OwlToken from "./abi/OwlToken.json";

export const coin = "Owl";

const API_URL = 'https://api.owldinal.xyz/api';

export const hKey = "b1e01052-f40d-4e26-a653-1f413767e4d4";

export const ContractAddress = {
    // test
    // owlTokenAddress: "0xF86EA7e636f43dd6dCD35B7E04742f5508F9CF73",
    // owldinalNftAddress: "0x96fB752fc565c740F8b09a1760FE5a3D89dD18E5",
    // owlGameAddress: "0xC0E5d058eeF687B0c3cEf2967D0B55AD81eb9C21",
    // genOneBoxAddress: "0xC9761572c264ADE5253d4F56a574fa0F4905ca5d",
    // local
    // owlTokenAddress: "0xf8bB8324Cd226f6229dbB8792C66119832791A59",
    // owldinalNftAddress: "0x73a11097dCf0817909039d2661a15cbc8F6624eF",
    // owlGameAddress: "0x8338B3295f87DEBa418c2F0bb7497414b0D73AC2",
    // genOneBoxAddress: "0xB9D8660b4a45aA24EC6dB53485E4334364C773A6",
    // prod
    owldinalNftAddress: "0x3cb8094fb209d21Aab2E474e91476EE9EEc332C9",
    owlTokenAddress: "0xf254dcD9e270B8E0B92A68e197BE7C6355e8d87b",
    genOneBoxAddress: "0xeF73c34E79BDb6b2f614ed163CFCA51237Ea83A3",
    owlGameAddress: "0xDe10BDb5912502117eb0Ad4387ae94Ac0Cd9D1d3",
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
    }
}

export const merlinTest = defineChain({
    id: 686868,
    name: 'Merlin Testnet',
    nativeCurrency: {name: 'BTC', symbol: 'BTC', decimals: 18},
    rpcUrls: {
        default: {
            http: [
                // 'https://testnet-rpc.merlinchain.io',
                // 'https://merlin-testnet.blockpi.network/v1/rpc/public',
                // 'https://merlin-testnet.blockpi.network/v1/rpc/264303e0e3d6db049249fc8e12b1eb13ebf37613',
                // 'https://merlin-testnet.blockpi.network/v1/rpc/97b12c2e9ff1fae02b5a4bcb137fc27a61afb3f1',
                'https://merlin-testnet.blockpi.network/v1/rpc/23e9f0e00ebe936f2228bb48c83f08ac658a66d6'
                // 'https://merlin-testnet-enterprise.unifra.io'
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
