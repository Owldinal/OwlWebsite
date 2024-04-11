import { useAccount, useSignMessage, useSwitchChain, useVerifyMessage } from "wagmi";
import logo from "@/assets/logo.png";
import OwlButton from "@components/Button/index.jsx";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import b1 from "@/assets/b1.png";
import { merlinTest } from "@/main.jsx";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import HomeHeader from "@components/Header.jsx";
import { merlin } from "viem/chains";

export default function (props) {

    const {isConnected, address, chain} = useAccount();
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    const {chains, switchChain} = useSwitchChain();
    const [inputValue, setInputValue] = useState("");
    const {signMessage, data: signature, error} = useSignMessage()
    const [visible, setVisible] = useState(false);
    const [result, setResult] = useState({});


    const targetChain = merlin;


    useEffect(() => {

        console.log("error: ", error);
        console.log("signature: ", signature);

        if (signature) {
            // post here
            const formData = new FormData();
            formData.append('eth_address', address);
            formData.append('bind_address', inputValue);
            formData.append('signedMessage', signature);

            fetch('https://bindapi.owldinal.xyz/bindEth', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    setResult(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }, [signature, error])

    const bind = async () => {

        if (result.res === true || result.res === false) {
            return;
        }

        await signMessage({
            message: inputValue,
        });

    }

    // const {data: verifyResult} = useVerifyMessage({
    //     address: address,
    //     message: inputValue,
    //     signature: signature,
    // })
    // console.log("result: ", verifyResult);

    return (
        <>
            <div className="rootInnerWrapper">

                <HomeHeader/>


                <div style={{margin: "24px 0", alignItems: "center", display: "flex", justifyContent: "space-between"}}>

                    <div style={{width: "40%"}}>
                        <img src={b1} alt={""}/>
                    </div>

                    <div style={{
                        width: "60%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>

                        <div style={{fontSize: "24px", marginBottom: "30px"}}>
                            Owldinal stands as the 1st pioneering
                        </div>
                        <div style={{fontSize: "24px", marginBottom: "30px"}}>
                            PFP collection natively built on
                        </div>
                        <a href={"https://twitter.com/MerlinLayer2"} target={"_blank"} style={{textDecoration: "none"}}>
                            <div style={{fontSize: "24px", marginBottom: "30px"}}>
                                @MerlinLayer2
                            </div>
                        </a>


                        {/*<div style={{fontSize: "16px", marginBottom: "10px"}}>Enter address here</div>*/}
                        <input type={"text"} value={inputValue}
                               size={45}
                               style={{
                                   backgroundColor: '#0a0a0a',
                                   borderRadius: '5px',
                                   lineHeight: '20px',
                                   color: '#414141',
                                   padding: '5px 10px',
                                   marginBottom: "30px"
                               }}
                               onChange={e => setInputValue(e.target.value)}/>

                        <div style={{
                            // width: "40%",
                            // marginLeft: "20%",
                            alignItems: "center",
                            display: "flex"
                        }}>
                            {!isConnected &&
                                <OwlButton func={openConnectModal} text="Connect wallet"/>}
                            {(isConnected && chain !== targetChain) &&
                                <OwlButton func={() => switchChain({chainId: targetChain.id})}
                                           text={"Switch to Merlin"}/>}
                            {(isConnected && chain === targetChain) &&
                                <OwlButton text={"Bind"} func={() => {
                                    if (inputValue.length === 42) {
                                        setVisible(true)
                                    }
                                }}/>}
                        </div>

                    </div>

                </div>

                <Modal
                    title={null}
                    open={visible}
                    onOk={bind}
                    onCancel={() => {
                        setVisible(false);
                        setResult({});
                    }}
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
                    {/*<h4 className="dialogTitle">{"Binding"}</h4>*/}
                    <div className={"text5"} style={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "24px",
                        marginTop: "24px"
                    }}>
                        <div>Are you sure want to use address:</div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div
                                style={{color: "#b4fd4f"}}>{address ? (address.slice(0, 6) + "..." + address.slice(38, 42)) : "" + " "}</div>
                            {" to bind to "}
                            <div
                                style={{color: "#b4fd4f"}}> {" " + inputValue ? (inputValue.slice(0, 6) + "..." + inputValue.slice(38, 42)) : ""}</div>
                        </div>


                        {/*{signature && (<div>{"Binding success"}</div>)}*/}
                        {/*<div>--------</div>*/}
                        {/*<OwlButton size={"middle"} text={signature ? signature : "Verifying"}/>*/}
                    </div>

                    <OwlButton size={"small"}
                               text={result.code ? (result.res ? "Binding success" : "Your address has been bound") : "Confirm"}
                               func={() => bind()}/>

                </Modal>

            </div>
        </>
    )


}
