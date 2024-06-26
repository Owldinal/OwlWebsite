import OwlButton from "@components/Button/index.jsx";
import ELF from "../../public/ELF.png";
import Magic from "../../public/Magic.png";
import { addCommaInNumber } from "@/util.js";
import { coin } from "@/config.js";

export default function (props) {

    return (
        <>
            <div className="tableItem flexBetween">
                <div style={{width: '35%', display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                        <img src={props.box_type === 1 ? ELF : Magic} alt={""} width={"35px"}/>
                    </div>
                    {(props.box_type === 1 ? "Elf" : "Magic Fruit") + " # " + props.token_id}
                </div>
                <div style={{width: '15%'}}>{addCommaInNumber(props.claimed)}</div>
                <div
                    style={{width: '20%'}}>{addCommaInNumber(props.earning)}</div>
                <div style={{width: '20%'}}>{addCommaInNumber(Number(props.apr) * 100) + "%"}</div>
                <div style={{width: '10%'}}>{props.is_staking === true ? 'Staked' : 'Available'}</div>
                <div style={{width: "10%", marginLeft: "10px"}}>
                    <OwlButton text={props.is_staking === true ? 'Unstake' : 'Stake'} size="small"
                               func={props.func}/>
                    {props.is_staking === true && (
                        <OwlButton style={{marginTop: "10px"}} text={'Claim'} size={"small"} func={props.funcOfClaim}/>
                    )}
                </div>
            </div>
        </>
    )

}
