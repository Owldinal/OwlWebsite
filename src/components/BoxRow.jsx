import OwlButton from "@components/Button/index.jsx";
import ELF from "../../public/ELF.png";
import Magic from "../../public/Magic.png";

export default function (props) {

    return (
        <>
            <div className="tableItem flexBetween">
                <div style={{width: '136px', display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                        <img src={props.box_type === 1 ? ELF : Magic} alt={""} width={"35px"}/>
                    </div>
                    {(props.box_type === 1 ? "Elf" : "Magic Fruit") + " # " + props.token_id}
                </div>
                <div
                    style={{width: '132px'}}>{props.earning.toString().split('.')[0]}</div>
                <div style={{width: '37px'}}>{props.apr.toString().split('.')[0] + "%"}</div>
                <div style={{width: '56px'}}>{props.is_staking === true ? 'Staked' : 'Available'}</div>
                <OwlButton text={props.is_staking === true ? 'Claim' : 'Stake'} size="small"
                           func={props.func}/>
            </div>
        </>
    )

}
