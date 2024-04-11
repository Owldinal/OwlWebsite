import { useAccount, useSignMessage, useSwitchChain, useVerifyMessage } from "wagmi";
import logo from "@/assets/logo.png";
import OwlButton from "@components/Button/index.jsx";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import b1 from "@/assets/b1.png";
import { merlinTest } from "@/main.jsx";
import { useEffect, useState } from "react";
import { Modal } from "antd";

export default function (props) {

    const {isConnected, address, chain} = useAccount();
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    const {chains, switchChain} = useSwitchChain();
    const [inputValue, setInputValue] = useState("");
    const {signMessage, data: signature, error} = useSignMessage()
    const [visible, setVisible] = useState(false);
    const [result, setResult] = useState({});


    const targetChain = merlinTest;


    useEffect(() => {

        console.log("error: ", error);
        console.log("signature: ", signature);

        // post here

    }, [signature, error])

    const bind = async () => {

        await signMessage({
            message: inputValue,
        });

    }

    const {data: verifyResult} = useVerifyMessage({
        address: address,
        message: inputValue,
        signature: signature,
    })
    console.log("result: ", verifyResult);

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

                        <div style={{fontSize: "16px", marginBottom: "10px"}}>Enter address here</div>
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
                                <OwlButton text={"Bind"} func={() => {
                                    if (inputValue.length === 42) {
                                        setVisible(true)
                                    }
                                }} size={"small"}/>
                            </div>
                        </div>

                    </div>

                </div>

                <Modal
                    title={null}
                    open={visible}
                    onOk={bind}
                    onCancel={() => setVisible(false)}
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
                    <h4 className="dialogTitle">{"Binding"}</h4>
                    <div>Your address: {address}</div>
                    <div style={{marginBottom: "20px"}}>Binding address: {inputValue}</div>

                    <OwlButton size={"middle"} text={signature ? "Binding success" : "Confirm"} disabled={!signature}
                               func={signature ? null : (() => bind())}/>
                    {/*{signature && (<div>{"Binding success"}</div>)}*/}
                    <div>--------</div>
                    <OwlButton size={"middle"} text={signature ? signature : "Verifying"}/>

                </Modal>

            </div>
        </>
    )


}
