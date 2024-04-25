import "./App.css";
import OwlButton from "./components/Button/index.jsx";
import { Modal, Tabs } from "antd";
import TopHeader from "@components/TopHeader/index.jsx";
import gif from "@/assets/owl.gif";
import BoxRow from "@components/BoxRow.jsx";
import OwlRow from "@components/OwlRow.jsx";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "@/main.jsx";
import { ContractAbi, ContractAddress } from "@/config.js";

const {TabPane} = Tabs;

function App(props) {

    const {contractAddress, targetChain} = props;
    const {isConnected, chain, address} = useAccount();
    const [userOwldinals, setUserOwldinals] = useState([]);
    const [hash, setHash] = useState("");

    const [dialogVisible, setDialogVisible] = useState(false);
    const [modelText, setModelText] = useState("");
    const [modelButton, setModelButton] = useState(false);
    const [owlGif, setOwlGif] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const data = [
        {
            owner: "0x273787eaafF5541ec58772dd7De4182e321439F0",
            nftid: 8
        },
        {
            owner: "0x8a77C80Cdf229d232639Ca28D31d392ac0D67174",
            nftid: 24
        },
        {
            owner: "0x8C7024c7105bc401D032343B0fdafC0F3EDB4D84",
            nftid: 26
        },
        {
            owner: "0xd12B2FA3c197e882DE59BE13c4e414eB2A6e7196",
            nftid: 56
        },
        {
            owner: "0xA1Cc792e3FFf1bCf5F79004a9fDd8F1b4B7799f0",
            nftid: 63
        },
        {
            owner: "0x445eb9761022c7D483ce3627eC9dA6580622f5Fa",
            nftid: 89
        },
        {
            owner: "0x83495590CBEf1Bb7e835f035143C81F1D69DAAD3",
            nftid: 96
        },
        {
            owner: "0xd12B2FA3c197e882DE59BE13c4e414eB2A6e7196",
            nftid: 138
        },
        {
            owner: "0xBa30fa89Cbb088dB75e37F77c230C944da26738A",
            nftid: 195
        },
        {
            owner: "0x209587254888aA973a78875E17D0A95FFf7A3F65",
            nftid: 209
        },
        {
            owner: "0x40B32f1E906FA57b30E2059b29c698C19DD6FE95",
            nftid: 211
        },
        {
            owner: "0xed9265b8215cc9437726241Ab899496A90F7f50A",
            nftid: 234
        },
        {
            owner: "0xed9265b8215cc9437726241Ab899496A90F7f50A",
            nftid: 276
        },
        {
            owner: "0xd12B2FA3c197e882DE59BE13c4e414eB2A6e7196",
            nftid: 288
        },
        {
            owner: "0x8A8bF818b9c3d5E77D650b51D1Ac6327935a9238",
            nftid: 317
        },
        {
            owner: "0x8a77C80Cdf229d232639Ca28D31d392ac0D67174",
            nftid: 400
        },
        {
            owner: "0xA3F98dcDdB8f7d14BC733bC202B1bcbD9Bce84B5",
            nftid: 453
        },
        {
            owner: "0x8a77C80Cdf229d232639Ca28D31d392ac0D67174",
            nftid: 463
        },
        {
            owner: "0x8A8bF818b9c3d5E77D650b51D1Ac6327935a9238",
            nftid: 577
        },
        {
            owner: "0x962750859D6605E33a08bA6eC61267395c16eB7B",
            nftid: 580
        },
        {
            owner: "0xD836f673a62A18AebD0c18DE437529e7A45ECAbA",
            nftid: 690
        },
        {
            owner: "0x7E37Ee9E8f47927AE190a343ea7034375093bE01",
            nftid: 706
        },
        {
            owner: "0xed9265b8215cc9437726241Ab899496A90F7f50A",
            nftid: 964
        }
    ];
    // const address = "0x8a77C80Cdf229d232639Ca28D31d392ac0D67174";

    useEffect(() => {
        const nftIds = data.reduce((acc, item) => {
            if (item.owner === address) {
                acc.push(item.nftid);
            }
            return acc;
        }, []);
        setUserOwldinals(nftIds);
        console.log("userOwldinals: ", nftIds)
    }, [address])

    const claimNFT = async (id) => {

        if (!address || !userOwldinals || !id) {
            return;
        }

        setModelText("")
        setOwlGif(true)
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 3))
        // }, 1000)

        let unstakeHash;
        try {
            unstakeHash = await writeContract(config, {
                address: ContractAddress.owlGameAddress,
                abi: ContractAbi.owlGame,
                functionName: "unstakeOwldinalNft",
                args: [id],
                // gas: 1000000n,
                // gasPrice: 1000000000n,
            })
        } catch (e) {
            console.warn(e);
            // clearInterval(interval)
            setModelText("Something went wrong, please contact us with message below.");
            setErrorMessage(e);
            setOwlGif(false)
            setModelButton(true);
            setDialogVisible(true);
            return;
        }

        const unstakeResult = await waitForTransactionReceipt(config, {hash: unstakeHash, pollingInterval: 1_000});
        // clearInterval(interval);
        if (unstakeResult.status === "success") {
            setHash(unstakeHash);
            // setTimeout(() => {
            //     setHash(unstakeHash + "refresh");
            // }, 3000)
            console.log("unstake NFT result: ", unstakeResult);
            setModelText("Success");
        } else {
            setModelText("Something went wrong, please contact us with message below.");
            setErrorMessage(unstakeResult);

        }
        setOwlGif(false);
        setModelButton(true)
    }

    return (

        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain}/>

            <Modal title={null}
                   open={dialogVisible}
                   footer={null}
                   onOk={() => setDialogVisible(false)}
                   onCancel={() => setDialogVisible(false)}
                   style={{
                       // display: "flex",
                       height: "500px",
                       width: "500px",
                       alignItems: "center",
                       justifyContent: "center",
                       top: "30%",
                       overflow: "auto"
                   }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "300px",
                }}>
                    {owlGif === true && (<div style={{height: "250px"}}><img src={gif} alt=""/></div>)}
                    {modelText && (
                        <div style={{marginBottom: "20px", marginTop: "100px", height: "50%"}}>
                            <h3>{modelText}</h3>
                            <div>{errorMessage}</div>
                        </div>
                    )}
                    {modelButton === true && (
                        <OwlButton size={"small"} text={"OK"}
                                   func={() => {
                                       setDialogVisible(false);
                                       setModelButton(false);
                                   }}/>)}
                </div>
            </Modal>

            <div className="flexStart">

                <div style={{
                    width: '100%',
                    padding: '16px',
                    height: "100%",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <div style={{height: "100%", width: "70%"}}>
                        <div className="flexBetween tableHeaderItem"
                             style={{backgroundColor: "#151515", height: "60px", padding: "30px "}}>
                            <div className="tableHeaderItem" style={{width: '40%', marginLeft: "20px"}}>NFT</div>
                            <div className="tableHeaderItem" style={{width: '40%'}}>Status</div>
                            <div className="tableHeaderItem" style={{width: '10%', marginRight: "20px"}}>Operate</div>
                        </div>

                        <div style={{overflowY: "scroll", height: "770px"}}>
                            {userOwldinals.length > 0 ?
                                userOwldinals.map((item, index) => {
                                    console.log("item:", item);
                                    const id = item;
                                    return <OwlRow key={index} tokenId={id} address={address}
                                                   func={() => claimNFT([id])}/>
                                })
                                : <div style={{
                                    textAlign: "center",
                                    marginTop: "20px"
                                }}>
                                    {address ? "No Owldinal to claim" : "Please connect wallet to check"}
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default App;
