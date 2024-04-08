import { useState, useEffect } from "react";
import "./App.css";
import cn from "classnames";
import OwlButton from "./components/Button/index.jsx";
import HomeHeader from "./components/Header";

import b1 from "./assets/b1.png";
import b2 from "./assets/b2.png";

import circle1 from "./assets/01circle.png";
import circle2 from "./assets/02circle.png";
import circle3 from "./assets/03circle.png";
import circle4 from "./assets/04circle.png";
import vector from "./assets/vector.png";

import { useAccountModal, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import {
    useAccount,
    useReadContracts,
    useSwitchChain,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import abi from "./abi.json";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";


function App(props) {

    const {contractAddress, targetChain} = props;

    const navigate = useNavigate();
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    // const {openChainModal, chainModalOpen} = useChainModal();
    const {isConnected, address, chain} = useAccount();
    const {chains, switchChain} = useSwitchChain();
    const {data: hash, writeContract, isPending, error} = useWriteContract()

    const totalNFT = 999;
    const price = 0.0045;
    const maxMint = 1;
    const hKey = "b1e01052-f40d-4e26-a653-1f413767e4d4";

    const [check, setCheck] = useState(1);
    const [passHcaptcha, setPassHcaptcha] = useState("");
    const [alreadyMinted, setAlreadyMinted] = useState(0);
    const [tab, setTab] = useState(1);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalImg, setModalImg] = useState("");
    const [urlId, setUrlId] = useState(-1);

    let open = true;
    let exec;

    const ipfsURL = "https://ipfs.io/ipfs/QmZPvN9YwEjLkrczWgRiPFshBxgx8Z4WXwheoErSKjJiGi/Owldinal";

    // useEffect(() => {
    //     console.log("account:", address);
    //     console.log("chain:", chain);
    //     console.log("targetChain:", targetChain);
    //     console.log("chains:", chains);
    // }, [address, chain])

    const handleScrollNew = (event) => {

        // window.removeEventListener("wheel", handleScrollNew);
        exec && clearTimeout(exec);
        // console.log("window.onwheel: ", event.deltaY);

        if (open) {

            let next;
            if (event.deltaY > 0) {
                next = Math.min(3, tab + 1);
            } else if (event.deltaY < 0) {
                next = Math.max(1, tab - 1);
            }

            if (next && next !== tab) {
                setTab(next);
                window.removeEventListener("wheel", handleScrollNew);
                open = false;
            }

        }

        exec = setTimeout(() => {
            open = true;
            // window.addEventListener("wheel", handleScrollNew);
            // addListener();
        }, 50);

    };

    useEffect(() => {

        setTimeout(() => {
            window.addEventListener("wheel", handleScrollNew);
        }, 800);
        return () => {
            window.removeEventListener("wheel", handleScrollNew);
        };

    }, [tab]);

    // const gas = useEstimateGas({
    //     address: contractAddress,
    //     abi,
    //     functionName: 'mint',
    //     args: [
    //         // response.data.signature,
    //         "0x883eda3a9a8011029728b5a78a4a2278e0edc66368335dcc82e7a4e49f8e21c417247a1b587d8cda4a7a722f2a242c7cd8b69cf71740b846aa6e689b2eadb7551b",
    //     ],
    // });
    // console.log("gas: ", gas);

    const mintNFT = async () => {

        setDialogVisible(true);

        console.log("hcaptcha: ", passHcaptcha);

        const url = 'https://api.owldinal.xyz/api/generateSignature';
        const data = {
            wallet: address,
            hcaptcha: passHcaptcha
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        console.log("response: ", resData);

        if (!response.ok) {
            console.warn(resData);
            return response;
        }

        const value = Math.ceil((price) * 10 ** 18);
        console.log("value:", value);

        writeContract({
            address: contractAddress,
            abi,
            functionName: 'mint',
            args: [
                resData.data.signature,
            ],
            value: BigInt(value),
        })

        // console.log("hash: ", hash);

    }

    const {isLoading: isConfirming, isSuccess: isConfirmed, data: receipt} =
        useWaitForTransactionReceipt({
            hash
        })

    const {
        data,
    } = useReadContracts({
        contracts: [
            {
                address: contractAddress,
                abi: abi,
                functionName: 'checkCanMint',
                args: [address]
            },
            {
                address: contractAddress,
                abi: abi,
                functionName: 'tokenIdCounter',
            },
        ],
    })

    const handleOk = () => {
        setDialogVisible(false);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const showModal = () => {
        setDialogVisible(true);
    };

    const convertHexToAscii = (hexString) => {
        // --LLM
        // 跳过前两个uint256，每个uint256占64个十六进制字符
        const trimmedHexString = hexString.slice(128);

        // 初始化一个空字符串用于存储最终的ASCII结果
        let asciiString = '';

        // 每次处理两个字符（一个字节）
        for (let i = 0; i < trimmedHexString.length; i += 2) {
            // 获取十六进制表示的字节
            const hexByte = trimmedHexString.substr(i, 2);
            // 将十六进制转换为十进制
            const decimal = parseInt(hexByte, 16);
            // 跳过解码后为0的字符，因为它们可能是填充的空字符
            if (decimal === 0) continue;
            // 将十进制转换为ASCII字符并添加到结果字符串
            asciiString += String.fromCharCode(decimal);
        }

        return asciiString;

    }

    useEffect(() => {
        console.log("data: ", data);

        const [checkCanMint, tokenIdCounter] = data || [];

        if (checkCanMint && checkCanMint.result && checkCanMint.result && tokenIdCounter) {
            if (checkCanMint.result[0] === true) {
                const mintType = Number(checkCanMint?.result[1]);
                if (mintType === 3) {
                    // token 1
                    setCheck(3);
                } else if (mintType === 1) {
                    // white list
                    setCheck(4);
                } else if (mintType === 2) {
                    // voya
                    setCheck(5);
                }
            } else if (checkCanMint.result[0] === false) {
                // not eligible
                setCheck(2);
            }

            setAlreadyMinted(Number(tokenIdCounter?.result) - 1 || 0);
            // console.log("address: ", address);
            // console.log("checkCanMint: ", checkCanMint);
            // console.log("alreadyMinted: ", alreadyMinted);
        }
    }, [data]);

    useEffect(() => {

        if (!address) {
            setCheck(1);
        }

    }, [address])

    useEffect(() => {

        if (error) {
            const e = error.toString();
            console.warn(e);
            if (e.includes("You have already minted a box")) {
                setModalText("You have already minted a box");
            } else if (e.includes("Not eligible to mint")) {
                setModalText("Not eligible to mint");
            } else if (e.includes("Insufficient BTC sent")) {
                setModalText("Insufficient BTC sent");
            } else if (e.includes("Invalid signature")) {
                setModalText("Please verify the captcha again");
                setPassHcaptcha(null);
            } else {
                setModalText(error.toString());
            }
        }
        if (isConfirmed) {
            setModalText("Transaction confirmed");
        }
        if (isConfirming) {
            setModalText("Waiting for transaction...");
        }
        if (isPending) {
            setModalText("Confirming...");
        }

        if (receipt) {
            let url = convertHexToAscii(receipt.logs[2].data);
            console.log(url);
            setUrlId(Number(url.substring(url.lastIndexOf('/') + 1)));
        }

        console.log("write contract: ");

        console.log("hash: ", hash, receipt);

        console.log("isConfirmed: ", isConfirming, isConfirmed);

        console.log("isPending: ", isPending, error);

    }, [hash, receipt, isConfirming, isPending, error]);

    useEffect(() => {

        setModalImg(ipfsURL + urlId + ".png");

    }, [urlId])

    return (
        <div className="rootInnerWrapper">
            <HomeHeader/>
            <div className="home">
                <div className="tabs flexColumnCenter">
                    <div
                        onClick={() => setTab(1)}
                        className={cn("tab flexCenter", tab === 1 && "activeTab")}
                    >
                        Narrative
                    </div>
                    <div
                        onClick={() => setTab(2)}
                        className={cn("tab flexCenter", tab === 2 && "activeTab")}
                    >
                        Mint
                    </div>
                    <div
                        onClick={() => setTab(3)}
                        className={cn("tab flexCenter", tab === 3 && "activeTab")}
                    >
                        Roadmap
                    </div>
                </div>
                <div className="content flexCenter">
                    {tab === 1 && (
                        <div className="tabItem flexCenter flexC">
                            <img
                                width="45%"
                                src={b1}
                                alt=""
                                className="margin0"
                                style={{marginRight: "24px"}}
                            />
                            <div className="tabText">
                                Owldinal introduces Merlin's NFT realm: mystic ERC721 Owls, legendary quests, and hidden
                                lore. A strategic, community-driven odyssey powered by enchantment and collective
                                creativity.
                            </div>
                        </div>
                    )}

                    {tab === 2 && (

                        <div className="tabItem flexCenter flexC">
                            <img
                                width="45%"
                                src={b2}
                                alt=""
                                style={{marginRight: "24px"}}
                                className="width60"
                            />
                            <div className="tabInfo flexColumnBetween width90">
                                <div style={{width: "100%"}}>
                                    <div className="tabInfoItem flexBetween">
                                        <div className="infoKey">Total Supply:</div>
                                        <div className="infoValue">{totalNFT}</div>
                                    </div>
                                    <div className="tabInfoItem flexBetween">
                                        <div className="infoKey">Price:</div>
                                        <div className="infoValue">{price + " BTC"}</div>
                                    </div>
                                    <div className="tabInfoItem flexBetween">
                                        <div className="infoKey">Max Mint Per Address:</div>
                                        <div className="infoValue">{maxMint}</div>
                                    </div>
                                    <div className="infoLine"></div>
                                    <div
                                        className="infoText1">{
                                        check === 1 ?
                                            (address ? "Checking your eligibility..." : "Please connect your wallet...") :
                                            check === 2 ?
                                                "You are not eligible." :
                                                check === 3 ?
                                                    "You can mint token one." :
                                                    check === 4 ?
                                                        "You are whitelisted." :
                                                        check === 5 ?
                                                            "You are eligible." :
                                                            ""}
                                    </div>
                                </div>
                                <div style={{width: "100%"}}>
                                    <div className="flexBetween">
                                        <div className="infoKey">{alreadyMinted}/{totalNFT}</div>
                                        <div className="infoKey">{(alreadyMinted / totalNFT * 100).toFixed(2)}%</div>
                                    </div>
                                    <div className="progress"></div>

                                    {check > 2 && (
                                        <>
                                            <form>
                                                <HCaptcha
                                                    sitekey={hKey}
                                                    onVerify={(token, ekey) => setPassHcaptcha(token)}
                                                />
                                            </form>

                                            <OwlButton
                                                size="big"
                                                text={passHcaptcha ? "Mint" : "Mint (please verify)"}
                                                style={passHcaptcha || hash || isConfirming ? {} : {
                                                    cursor: "not-allowed",
                                                    color: "grey"
                                                }}
                                                isConfirming={isConfirming}
                                                check={check}
                                                // func={mintNFT}
                                                func={passHcaptcha ? mintNFT : null}
                                                error={error}/>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 3 && (

                        <div className="tabItem flexBetween">

                            <div className="tabCard flexColumnCenter">
                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="circle">
                                        <img width="100%" height="100%" src={circle1} alt=""
                                             style={{alignSelf: "center", padding: "30%"}}/>
                                    </div>
                                </div>

                                <div className="cardTitle">Gen0 Box Mint</div>
                            </div>

                            <div className="">
                                <img src={vector} alt=""
                                     style={{flexFlow: "column", position: "relative", width: "80%"}}/>
                            </div>

                            <div className="tabCard flexColumnCenter">
                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="circle">
                                        <img width="100%" height="100%" src={circle2} alt=""
                                             style={{alignSelf: "center", padding: "30%"}}/>
                                    </div>
                                </div>

                                <div className="cardTitle">Staking Gameplay</div>
                            </div>

                            <div className="">
                                <img src={vector} alt=""
                                     style={{flexFlow: "column", position: "relative", width: "80%"}}/>
                            </div>

                            <div className="tabCard flexColumnCenter">
                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="circle">
                                        <img width="100%" height="100%" src={circle3} alt=""
                                             style={{alignSelf: "center", padding: "30%"}}/>
                                    </div>
                                </div>

                                <div className="cardTitle">Breeding Gameplay</div>
                            </div>

                            <div className="">
                                <img src={vector} alt=""
                                     style={{flexFlow: "column", position: "relative", width: "80%"}}/>
                            </div>

                            <div className="tabCard flexColumnCenter">
                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="circle">
                                        <img width="100%" height="100%" src={circle4} alt=""
                                             style={{alignSelf: "center", padding: "30%"}}/>
                                    </div>
                                </div>

                                <div className="cardTitle">Cave Gameplay</div>
                            </div>

                        </div>
                    )}
                </div>

                <div className="tabs flexColumnCenter">


                    {!isConnected && <div
                        className="tab flexCenter"
                        onClick={openConnectModal}
                    >
                        Connect wallet
                    </div>}

                    {(isConnected && chain !== targetChain) && <div
                        className="tab flexCenter"
                        onClick={() => switchChain({chainId: targetChain.id})}
                    >
                        Switch to Merlin
                    </div>}

                    {(isConnected && chain === targetChain) && <div
                        className="tab flexCenter"
                        onClick={openAccountModal}
                    >
                        {address.slice(0, 6) + "..." + address.slice(-4)}
                    </div>}


                    <div
                        onClick={() => setTab(2)}
                        className={cn("tab flexCenter", tab === 2 && "activeTab")}
                    >
                        Mint
                    </div>


                    <div className="tab flexCenter" onClick={() => navigate("/treasury")}>
                        Play
                    </div>
                    {/*<div className="disabledTab flexCenter">Play</div>*/}


                </div>

                <Modal
                    title={null}
                    open={dialogVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        top: 0,
                        width: "70%",
                        overflow: "auto"
                    }}
                >
                    <h4 className="dialogTitle">{modalText}</h4>
                    {isConfirmed && (
                        <img style={{width: "100%"}} src={modalImg} alt=""/>
                    )}
                </Modal>

            </div>
        </div>
    )
        ;
}

export default App;
