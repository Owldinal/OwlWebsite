import './index.css'
import cn from "classnames";


export default function (props) {
    const typeClassMap = {
        dark: "darkBtn", light: "lightBtn", primary: "primaryBtn",
    };
    const sizeClassMap = {
        big: "bigBtn", normal: "normalBtn", small: 'smallBtn'
    };
    const typeClassName = typeClassMap[props.type || "primary"];
    const sizeClassName = sizeClassMap[props.size || "normal"];
    
    const displayContent =
        props.isConfirmed ? props.hash :
            props.isConfirming ? 'Confirming...' :
                props.error ? 'You can\'t mint more' :
                    props.text;
    
    return <div className={cn("owlBtn", typeClassName, sizeClassName)}
                style={props.style}
                onClick={props.isConfirmed ? null : props.func}>{displayContent}</div>;
}
