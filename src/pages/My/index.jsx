import { Fragment, useEffect, useState } from "react";
import "./index.css";
import cn from "classnames";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import arrup from "@/assets/arrup.png";
import a1 from "@/assets/a1.png";
import copy from "@/assets/copy.png";
import bage1 from "@/assets/bage1.png";
import bage2 from "@/assets/bage2.png";
import bage3 from "@/assets/bage3.png";
import { useNavigate } from "react-router-dom";

import { Tabs } from "antd";

const {TabPane} = Tabs;
import { tableData } from "./data.jsx";
import { useAccount } from "wagmi";
import { getData } from "@/config.js";
import ArrowAndNumber from "@components/ArrowAndNumber.jsx";
import { addCommaInNumber } from "@/util.js";
import NFTRow from "@components/NFTRow.jsx";

function App(props) {

    const navigate = useNavigate();
    const {contractAddress, targetChain} = props;
    const {isConnected, address, chain} = useAccount();

    const [userInfo, setUserInfo] = useState({

        wallet: "0x0000000000000000000000000000000000000000",
        owl_balance: 0,
        total_earned: 0,
        buff_level: 3,
        elf_info: {total: 0, staked: 0, apr: 0},
        fruit_info: {total: 0, staked: 0, apr: 0},
        owl_info: {total: 0, staked: 0, apr: 0},
        referral_rewards: {
            total: 0,
            claimed: 0,
            available: 0,
            locked: 0
        },
        invitation_code: "",
        invite_count: 0

    });
    const [userOwldinals, setUserOwldinals] = useState([
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        }, {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "mint"
        },

    ]);
    const [userFruitAndELf, setUserFruitAndELf] = useState([
        {
            token_id: 0,
            type: "",
            token_url: "",
            earning: 0,
            apr: 0,
            status: "open"
        }
    ]);

    useEffect(() => {

        getData.getUserInfo(address).then(result => {
            console.log("user info result: ", result);
            setUserInfo(result.data);
        })

        // getData.getUserOwldinals(address, 1, 10).then(result => {
        //     console.log("user owldinals result: ", result);
        //     setUserOwldinals(result.data);
        // })
        //
        // getData.getUserBoxes(address, 1, 10).then(result => {
        //     console.log("user boxes result: ", result);
        //     setUserBoxes(result.data);
        // })

    }, [address]);

    const copyOnClick = (address) => {

        if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(() => {
                console.log('Address copied to clipboard:', address);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

    }

    return (
        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain}/>
            <div className="flexStart">
                <Sider/>
                <div style={{width: '100%', padding: '16px', height: "100%"}}>
                    <div className="flexBetween flexC" style={{margin: "24px 0", alignItems: "flex-start"}}>
                        <div className="infoCard inputCard width100" style={{minWidth: ""}}>
                            <div className="text1 flexStartCenter">
                                {/*<span>*/}
                                {/*  <img src={a1} width="48" alt="" className="boderRadius50"/>*/}
                                {/*</span>{" "}*/}
                                <span
                                    style={{margin: "0 8px 0 0px"}}>{address || "Please connect your wallet"}
                                </span>{" "}
                                {address && (
                                    <img src={copy} width="12" alt="" onClick={() => copyOnClick(address)}/>
                                )}
                            </div>

                            <div className="text2 ">
                                {userInfo["owl_balance"]}<span> Owl</span>
                            </div>

                            <div className="text3">Total Earned</div>

                            <div className="flexStart" style={{margin: "16px 0 32px"}}>
                                {(userInfo["buff_level"] === 1 || userInfo["buff_level"] === 3) && (
                                    <img src={bage1} width="48" alt=""/>)}
                                {(userInfo["buff_level"] === 2 || userInfo["buff_level"] === 3) && (
                                    <img
                                        src={bage2}
                                        width="48"
                                        alt=""
                                        style={{margin: "0 16px"}}
                                    />)}
                                {(userInfo["buff_level"] === 3) && (<img src={bage3} width="48" alt=""/>)}
                            </div>

                            <div className="flexBetween flexS">
                                <div className="infoItem2" style={{textAlign: "center", marginRight: '12px'}}>
                                    <div className="flexBetween">
                                        <div className="text5">ELF</div>
                                        <ArrowAndNumber arrow={userInfo["elf_info"]["apr"] >= 0 ? 1 : 0}
                                                        text={"APR: " + userInfo["elf_info"]["apr"] || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["elf_info"]["staked"]}/{userInfo["elf_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text="Stake All"
                                        style={{width: "100%", marginTop: "24px"}}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text="Claim All"
                                        style={{width: "100%", marginTop: "8px"}}
                                    />
                                </div>

                                <div className="infoItem2" style={{textAlign: "center"}}>
                                    <div className="flexBetween">
                                        <div className="text5">Magic Fruit</div>
                                        <ArrowAndNumber arrow={userInfo["fruit_info"]["apr"] >= 0 ? 1 : 0}
                                                        text={"APR: " + userInfo["fruit_info"]["apr"] || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["fruit_info"]["staked"]}/{userInfo["fruit_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text="Stake All"
                                        style={{width: "100%", marginTop: "24px"}}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text="Claim All"
                                        style={{width: "100%", marginTop: "8px"}}
                                    />
                                </div>
                            </div>

                            <div className="infoItem2" style={{margin: "16px 0"}}>
                                <div className="text5" style={{marginBottom: "30px"}}>
                                    Referral Rewards
                                </div>

                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="text3">Claimed</div>
                                    <div
                                        className="text5">{addCommaInNumber(userInfo["referral_rewards"]["claimed"])}</div>
                                </div>
                                <div
                                    className="flexBetween"
                                    style={{width: "100%", margin: "16px 0"}}
                                >
                                    <div className="text3">Available</div>
                                    <div
                                        className="text5">{addCommaInNumber(userInfo["referral_rewards"]["available"])}</div>
                                </div>
                                <div className="flexBetween" style={{width: "100%"}}>
                                    <div className="text3">Locked</div>
                                    <div
                                        className="text5">{addCommaInNumber(userInfo["referral_rewards"]["locked"])}</div>
                                </div>

                                <OwlButton
                                    type="dark"
                                    text={"Claim " + addCommaInNumber(userInfo["referral_rewards"]["available"]) + " Owl"}
                                    style={{width: "100%", marginTop: "36px", color: "#9EFF00"}}
                                />

                                <div className="flexBetween" style={{margin: "32px 0 8px"}}>
                                    <div className="text3">Invitation link</div>
                                    <div className="text6">Invite list ({userInfo["invite_count"]})</div>
                                </div>

                                <div className="flexBetween linkInfo">
                                    <div className="text5">https:
                                        <img src={copy} width="12" alt=""
                                             onClick={() => copyOnClick(userInfo["invitation_code"])}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="tableWrapper">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Treasury Revenue" key="1">
                                    <div className="tableItem flexBetween tableHeader">
                                        <div className="tableHeaderItem" style={{width: '136px'}}>NFT</div>
                                        <div className="tableHeaderItem" style={{width: '132px'}}>Earning</div>
                                        <div className="tableHeaderItem" style={{width: '37px'}}>APR</div>
                                        <div className="tableHeaderItem" style={{width: '56px'}}>Status</div>
                                        <div className="tableHeaderItem" style={{width: '78px'}}>Operate</div>
                                    </div>

                                    <div style={{overflowY: "scroll", height: "770px"}}>
                                        {userFruitAndELf.map((item, index) => {
                                            const {token_id, type, token_url, earning, apr, status} = item;
                                            return <NFTRow token_id={token_id} earning={earning} apr={apr}
                                                           status={status}/>
                                        })}
                                    </div>

                                </TabPane>
                                <TabPane tab="My Owldinal" key="2">
                                    <div style={{height: "100%"}}>

                                        <div className="tableItem flexBetween tableHeader">
                                            <div className="tableHeaderItem" style={{width: '136px'}}>NFT</div>
                                            <div className="tableHeaderItem" style={{width: '132px'}}>Earning</div>
                                            <div className="tableHeaderItem" style={{width: '37px'}}>APR</div>
                                            <div className="tableHeaderItem" style={{width: '56px'}}>Status</div>
                                            <div className="tableHeaderItem" style={{width: '78px'}}>Operate</div>
                                        </div>

                                        <div style={{overflowY: "scroll", height: "770px"}}>
                                            {userOwldinals.map((item, index) => {
                                                const {token_id, type, token_url, earning, apr, status} = item;
                                                return <NFTRow token_id={token_id} earning={earning} apr={apr}
                                                               status={status}/>
                                            })}
                                        </div>

                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
