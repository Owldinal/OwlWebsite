import arrup from "@/assets/arrup.png";
import arrdown from "@/assets/arrdown.png";

export default function (props) {

    return (
        <>
            <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                <img src={props.arrow === 1 ? arrup : arrdown} width={10} alt={""}/>
                <div className={props.arrow === 1 ? "infoItemTextUp" : "infoItemTextDown"}>
                    {props.text || "0%"}
                </div>
            </div>
        </>
    )
}
