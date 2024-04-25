import OwlButton from "@components/Button/index.jsx";
import { useEffect, useState } from "react";
import { readContracts } from "@wagmi/core";
import { config } from "@/main.jsx";
import { ContractAbi, ContractAddress } from "@/config.js";

export default function (props) {

    const [isStaking, setIsStaking] = useState(false);

    useEffect(() => {
        const checkStake = async () => {
            return await readContracts(config, {
                contracts: [{
                    address: ContractAddress.owldinalNftAddress,
                    abi: ContractAbi.owldinalNft,
                    functionName: "ownerOf",
                    args: [BigInt(props.tokenId)],
                }]
            })
        }
        checkStake().then((result) => {
            console.log("id: ", props.tokenId, result)
            setIsStaking(result[0].result === ContractAddress.owlGameAddress)
        });
    })

    return (
        <>
            <div className="flexBetween" style={{backgroundColor: "#151515", height: "60px", padding: "30px",marginTop: "10px"}}>
                <div style={{width: '40%', display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                        <img
                            src={"https://ipfs.io/ipfs/QmZPvN9YwEjLkrczWgRiPFshBxgx8Z4WXwheoErSKjJiGi/Owldinal" + props.tokenId + ".png"}
                            alt={""} width={"35px"}/>
                    </div>
                    {"Owldinal" + " # " + props.tokenId}
                </div>
                <div style={{width: '40%'}}>{isStaking === true ? 'Staked' : 'Available'}</div>
                <div style={{width: "10%"}}>
                    <OwlButton text={'Unstake'} size="small"
                               type={isStaking === true ? "primary" : "light"}
                               func={isStaking === true ? props.func : null}/>
                </div>
            </div>
        </>
    )

}
