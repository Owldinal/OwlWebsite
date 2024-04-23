import ArrowAndNumber from "@components/ArrowAndNumber.jsx";
import { addCommaInNumber } from "@/util.js";

export default function (props) {

    return (
        <>
            <div className="infoItem flexBetweenStart"
                 style={{marginRight: "16px", marginBottom: '6px'}}>
                <div>
                    <div className="infoItemText1">{props.content}</div>
                    <div className="infoItemText2">{props.title}</div>
                </div>
                {props.change && (
                    <ArrowAndNumber arrow={props.change >= 0 ? 1 : 0}
                                    text={addCommaInNumber((Number(props.change) * 100).toString().split('.')[0]) + "%"}/>
                )}
            </div>
        </>
    )

}
