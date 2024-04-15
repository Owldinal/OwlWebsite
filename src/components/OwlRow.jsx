import OwlButton from "@components/Button/index.jsx";
import ELF from "../../public/ELF.png";
import Magic from "../../public/Magic.png";

export default function (props) {

    return (
        <>
            <div className="tableItem flexBetween">
                <div style={{width: '40%', display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                        <img
                            src={"https://ipfs.io/ipfs/QmZPvN9YwEjLkrczWgRiPFshBxgx8Z4WXwheoErSKjJiGi/Owldinal" + props.token_id + ".png"}
                            alt={""} width={"35px"}/>
                    </div>
                    {"Owldinal" + " # " + props.token_id}
                </div>
                <div style={{width: '40%'}}>{props.is_staking === true ? 'Staked' : 'Available'}</div>
                <div style={{width: "10%"}}>
                    <OwlButton text={props.is_staking === true ? 'Claim' : 'Stake'} size="small"
                               func={props.func}/>
                </div>
            </div>
        </>
    )

}
