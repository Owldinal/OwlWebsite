import logo from "../assets/logo.png";
import star from "../assets/star40.png";
import book from "../assets/book.png";
import x from "../assets/x.png";
import tel from "../assets/tel.png";

export default function header() {
    
    const iconBox = {
        display: "flex",
        position: "absolute",
        right: 50,
        justifyContent: "space-between",
        padding: "24px"
    }
    
    const icon = {
        margin: "24px"
    }
    
    return (
        <div>
            <div className="homeHead flexCenter">
                <img
                    src={logo}
                    height="60"
                    alt=""
                    style={{marginRight: "24px"}}
                />{" "}
                Owldinal
                <div className="star1">
                    <img src={star} width="40" alt=""/>
                </div>
                <div className="star2">
                    <img src={star} width="32" alt=""/>
                </div>
                <div className="star3">
                    <img src={star} width="32" alt=""/>
                </div>
                {/*<div className="star4">*/}
                {/*    <img src={ star } width="48" alt=""/>*/}
                {/*</div>*/}
                
                <div style={iconBox}>
                    
                    <a href="https://twitter.com/Owldinal" target="_blank">
                        <img src={x} width="24" alt="https://twitter.com/Owldinal" style={icon}/>
                    </a>
                    
                    <a href="https://t.me/owldinals" target="_blank">
                        <img src={tel} width="24" alt="https://t.me/owldinals" style={icon}/>
                    </a>
                    
                    <a href="https://doc.owldinal.xyz/" target="_blank">
                        <img src={book} width="24" alt="https://doc.owldinal.xyz/" style={icon}/>
                    </a>
                
                </div>
            
            </div>
        </div>
    );
}
