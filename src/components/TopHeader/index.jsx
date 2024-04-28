import "./index.css";
import cn from "classnames";
import logo from "@/assets/logo.png";
import OwlButton from "@/components/Button/index.jsx";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate()
  return (
    <div>
      <div className="topHead flexBetween">
        <div className='flexCenter' onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>

          <img src={logo} height="40" alt="" style={{ marginRight: "24px" }} />
          <div>
          Owldinal
          </div>
          
        </div>

        <div className="flexCenter">
          <OwlButton text="2,731,345.87 Owl" type="dark" />
          <OwlButton text="Buy Owl" type="dark" style={{ margin: "0 16px" }} />
          <OwlButton text="Connect to Merlin" />
        </div>
      </div>
    </div>
  );
}
