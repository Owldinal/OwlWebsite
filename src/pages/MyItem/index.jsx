import { useState } from "react";
import "./index.css";
import cn from "classnames";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import a1 from "@/assets/a1.png";
import box2 from "@/assets/box2.png";
import ar13 from "@/assets/ar13.png";

import { tableData } from "./data.jsx";

function App(props) {
    const [activeImg, setActiveImg] = useState(1);

    const {contractAddress, targetChain} = props;

    return (
        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain}/>
            <div className="flexStart">
                <Sider/>
                <div className="" style={{width: '100%', padding: '16px'}}>
                    <div className="flexBetween flexC" style={{margin: "24px 0"}}>
                        <div className="infoCard inputCard" style={{minWidth: "480px"}}>
                            <img src={ar13} width="100%" alt=""/>

                            <div className="text7" style={{margin: "32px 0 16px"}}>
                                Owl #53804
                            </div>

                            <div className="text1 flexBetween">
                                <div className="flexBetween">
                  <span>
                    <img src={a1} width="32" alt="" className="boderRadius50"/>
                  </span>
                                    <span style={{fontSize: "14px", marginLeft: "12px"}}>
                    CryptoGuysNFT
                  </span>
                                </div>

                                <img src={box2} width="24" alt=""/>
                            </div>

                            <div className="text3" style={{margin: "16px 0"}}>
                                Available
                            </div>

                            <OwlButton
                                text="Stake"
                                style={{width: "100%", marginTop: "36px"}}
                            />
                        </div>
                        <div className="tableWrapper">
                            <div className="flexBetween" style={{marginBottom: '36px'}}>
                                <div className="text4">My NFT</div>
                                <div className="flexBetween">
                                    <OwlButton type="dark" text="Owl" size="small"/>
                                    <OwlButton
                                        text="ELF"
                                        size="small"
                                        type="dark"
                                        style={{margin: "0 8px"}}
                                    />
                                    <OwlButton type="dark" text="MF" size="small"/>
                                </div>
                            </div>

                            <div className="flexWrap">
                                {tableData.map((item, index) => {
                                    return (
                                        <div
                                            className={cn(
                                                "imgItem",
                                                activeImg === index && "imgItemActive"
                                            )}
                                            key={index}
                                            onClick={() => setActiveImg(index)}
                                        >
                                            <img src={item} width="100%" alt=""/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
