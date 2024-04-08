import "./index.css";
import cn from "classnames";
import logo from "@/assets/logo.png";
import { useState } from "react";
import x from "@/assets/x.png";
import plane from "@/assets/plane.png";
import file from "@/assets/file.png";
import { useNavigate } from "react-router-dom";
import tel from "@/assets/tel.png";
import book from "@/assets/book.png";

export default function () {
    console.log("location: ", location);
    const navigate = useNavigate()
    const {pathname} = location;
    const [activeMenu, setActiveMenu] = useState(
        pathname === "/treasury" ? 1 : 2
    );

    return (

        <div className="sider flexColumnBetween">

            <div className="flexColumnStart">
                <div
                    onClick={() => {
                        navigate("/treasury");
                        setActiveMenu(1);
                    }}
                    className={cn("siderItem menu1", activeMenu === 1 && "activeMenu1")}
                >
                    Treasury
                </div>
                <div
                    onClick={() => {
                        navigate("/my");
                        setActiveMenu(2);
                    }}
                    className={cn("siderItem menu2", activeMenu === 2 && "activeMenu2")}
                >
                    My
                </div>
            </div>

            <div>

                <div className="siderIcon">
                    {/*<img src={x} width="24" alt=""/>*/}
                    <a href="https://twitter.com/Owldinal" target="_blank">
                        <img src={x} width="24" alt="https://twitter.com/Owldinal"/>
                    </a>
                </div>

                <div className="siderIcon">
                    {/*<img src={plane} width="24" alt="" style={{margin: "48px 0"}}/>*/}
                    <a href="https://t.me/owldinals" target="_blank">
                        <img src={tel} width="24" alt="https://t.me/owldinals"/>
                    </a>
                </div>

                <div className="siderIcon">
                    {/*<img src={file} width="24" alt=""/>*/}
                    <a href="https://doc.owldinal.xyz/" target="_blank">
                        <img src={book} width="24" alt="https://doc.owldinal.xyz/"/>
                    </a>
                </div>

            </div>

        </div>

    );
}
