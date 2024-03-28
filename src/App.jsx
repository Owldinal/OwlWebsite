import { useState, useEffect } from "react";
import "./App.css";
import cn from "classnames";
import OwlButton from "./components/Button/index.jsx";
import HomeHeader from "./components/Header";

import b1 from "./assets/b1.png";
import b2 from "./assets/b2.png";
import dot from "./assets/dot.png";
import n1 from "./assets/01.png";
import n2 from "./assets/02.png";
import n3 from "./assets/03.png";
import n4 from "./assets/04.png";
import circle1 from "./assets/01circle.png";
import circle2 from "./assets/02circle.png";
import circle3 from "./assets/03circle.png";
import circle4 from "./assets/04circle.png";
import vector from "./assets/vector.png";
import icon from "./assets/icon.png";

import { useNavigate } from "react-router-dom";

import { useAccountModal, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import {
    useAccount,
    useReadContract,
    useSendTransaction,
    useSwitchChain,
    useWaitForTransactionReceipt,
    useWriteContract
} from "wagmi";
import { Modal } from "antd";
import { merlin, sepolia } from "viem/chains";
import abi from "./abi.json";
import { merlinTest } from "@/main.jsx";


function App() {
    
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    const {openChainModal, chainModalOpen} = useChainModal();
    const {isConnected, address, chain} = useAccount();
    const {chains, switchChain} = useSwitchChain();
    const {data: hash, writeContract, isPending, error} = useWriteContract()
    
    const navigate = useNavigate();
    
    const [tab, setTab] = useState(1);
    const [dialogVisible, setDialogVisible] = useState(false);
    // const [scrollDirection, setScrollDirection] = useState(null);
    // const [open, setOpen] = useState(true);
    
    let open = true;
    let exec;
    
    function addListener() {
        window.addEventListener("wheel", handleScrollNew);
    }
    
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
            
            if (next !== tab) {
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
    
    const targetChain = merlin;
    const contractAddress = "0xB355F8BcE17f946CC267B2D8632DbD9Dd8242297";
    const totalNFT = 999;
    const price = "0.0045BTC";
    const maxMint = 1;
    
    const {
        data,
    } = useReadContract({
        address: contractAddress,
        abi: abi,
        functionName: 'tokenIdCounter',
    })
    
    const alreadyMinted = data || 0;
    
    
    const {isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
        })
    
    const mintNFT = () => {
        
        writeContract({
            address: contractAddress,
            abi: abi,
            functionName: 'mintByWhiteList',
        })
        
    }
    
    const handleOk = () => {
        setDialogVisible(false);
    };
    
    const handleCancel = () => {
        setDialogVisible(false);
    };
    
    const showModal = () => {
        setDialogVisible(true);
    };
    
    const debounce = (fn, wait) => {
        let timeout = null;
        return function () {
            let context = this;
            let args = arguments;
            if (timeout) clearTimeout(timeout);
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) fn.apply(context, args);
        };
    };
    
    const handleScroll = (e) => {
        console.log("e: ", e);
        console.log("tab: ", tab);
        let fn = debounce(() => {
            if (tab === 1) {
                setTab(2)
            } else if (tab === 2) {
                setTab(3)
            } else {
                setTab(1)
            }
        }, 1000)
        fn()
        
        
    };
    
    // useEffect(() => {
    //
    //     let scrollTimeout
    //     document.addEventListener('wheel', () => {
    //         scrollTimeout && clearTimeout(scrollTimeout);
    //         console.log('clearTimeout: ', clearTimeout);
    //
    //         scrollTimeout = setTimeout(() => {
    //             console.log('滚轮停止滚动');
    //             if (tab === 1) {
    //                 setTab(2)
    //             } else if (tab === 2) {
    //                 setTab(3)
    //             } else {
    //                 setTab(1)
    //             }
    //         }, 50);
    //     });
    // }, [tab]);
    
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
                                        <div className="infoValue">{price}</div>
                                    </div>
                                    <div className="tabInfoItem flexBetween">
                                        <div className="infoKey">Max Mint Per Address:</div>
                                        <div className="infoValue">{maxMint}</div>
                                    </div>
                                    <div className="infoLine"></div>
                                    <div className="infoText1">You are eligible</div>
                                </div>
                                <div style={{width: "100%"}}>
                                    <div className="flexBetween">
                                        <div className="infoKey">{alreadyMinted}/{totalNFT}</div>
                                        <div className="infoKey">{(alreadyMinted / totalNFT * 100).toFixed(2)}%</div>
                                    </div>
                                    <div className="progress"></div>
                                    
                                    <OwlButton
                                        // text="Mint"
                                        size="big"
                                        text={"Mint (Coming soon)"}
                                        style={{cursor: "not-allowed", color: "grey"}}
                                        isConfirmed={isConfirmed}
                                        isConfirming={isConfirming}
                                        hash={hash}
                                        // func={mintNFT}
                                        error={error}/>
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
                    
                    
                    {/*<div className="tab flexCenter" onClick={() => navigate("/treasury")}>*/}
                    {/*    Play*/}
                    {/*</div>*/}
                    <div className="disabledTab flexCenter">Play</div>
                
                
                </div>
                
                <Modal
                    title={null}
                    open={dialogVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <h4 className="dialogTitle">Choose wallet</h4>
                    
                    <div className="dItem">
                        <img width="24" src={icon} alt="" className="dIcon"/> OKX
                    </div>
                    <div className="dItem">UniSat</div>
                </Modal>
            </div>
        </div>
    );
}

export default App;
