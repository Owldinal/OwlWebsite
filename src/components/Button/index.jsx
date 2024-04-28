import './index.css'
import cn from "classnames";


export default function (props) {
  const typeClassMap = {
    dark: "darkBtn",
    light: "lightBtn",
    primary: "primaryBtn",
  };
  const sizeClassMap = {
    big: "bigBtn",
    normal: "normalBtn",
    small:'smallBtn'
  };
  const typeClassName = typeClassMap[props.type || "primary"];
  const sizeClassName = sizeClassMap[props.size || "normal"];

  return <div className={cn("owlBtn", typeClassName, sizeClassName, props.className)} style={props.style}>{props.text}</div>;
}
