import { useAccount, useSignMessage, useSwitchChain } from "wagmi";
import logo from "@/assets/logo.png";
import OwlButton from "@components/Button/index.jsx";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import b1 from "@/assets/b1.png";
import { merlinTest } from "@/main.jsx";
import { useEffect, useState } from "react";

export default function (props) {

    const {isConnected, address, chain} = useAccount();
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    const {chains, switchChain} = useSwitchChain();
    const [inputValue, setInputValue] = useState("");
    const {signMessage, data: signature, error} = useSignMessage()


    const targetChain = merlinTest;

    const bind = async () => {

        await signMessage({
            message: inputValue,
        });

    }

    useEffect(() => {

        console.log("error: ", error);
        console.log("signature: ", signature);

        // post here


    }, [signature, error])

    return (
        <>
            <div className="rootInnerWrapper">

                <div className="topHead flexBetween">
                    <div className='flexCenter'>

                        <img src={logo} height="40" alt="" style={{marginRight: "24px"}}/>
                        <div>
                            Owldinal
                        </div>

                    </div>

                    <div className="flexCenter">

                        {!isConnected &&
                            <OwlButton func={openConnectModal} text="Connect wallet"/>}

                        {(isConnected && chain !== targetChain) &&
                            <OwlButton func={() => switchChain({chainId: targetChain.id})}
                                       text={"Switch to Merlin"}/>}

                        {(isConnected && chain === targetChain) &&
                            <OwlButton func={openAccountModal}
                                       text={address.slice(0, 6) + "..." + address.slice(-4)}/>}

                    </div>

                </div>

                <div style={{margin: "24px 0", alignItems: "center", display: "flex", justifyContent: "space-between"}}>

                    <div style={{width: "40%"}}>
                        <img src={b1} alt={""}/>
                    </div>

                    <div style={{width: "60%"}}>

                        <div style={{fontSize: "24px", marginBottom: "30px"}}>
                            A sentence
                        </div>

                        <div style={{fontSize: "16px", marginBottom: "10px"}}>Enter your sentence here</div>
                        <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                            <input type={"text"} value={inputValue}
                                   size={45}
                                   style={{
                                       backgroundColor: 'lightgray',
                                       borderRadius: '5px',
                                       lineHeight: '20px',
                                       color: 'black',
                                       padding: '5px 10px'
                                   }}
                                   onChange={e => setInputValue(e.target.value)}/>

                            <div style={{
                                width: "40%",
                                marginLeft: "5%",
                                alignItems: "center",
                                display: "flex"
                            }}>
                                <OwlButton text={"Bind"} func={bind} size={"small"}/>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )


}
