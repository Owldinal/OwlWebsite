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

import { useAccount } from "wagmi";
import { ContractAbi, ContractAddress, getData } from "@/config.js";
import ArrowAndNumber from "@components/ArrowAndNumber.jsx";
import { addCommaInNumber } from "@/util.js";
import BoxRow from "@components/BoxRow.jsx";
import OwlRow from "@components/OwlRow.jsx";
import { getTransactionReceipt, readContracts, writeContract } from "@wagmi/core";
import { config } from "@/main.jsx";

const {TabPane} = Tabs;


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
    const [userOwldinals, setUserOwldinals] = useState();
    const [userFruitAndELf, setUserFruitAndELf] = useState();

    const [isApprove, setIsApprove] = useState(false);
    const [hash, setHash] = useState();

    const [assumeNew, setAssumeNew] = useState(false);

    useEffect(() => {
        if (!address) {
            setAssumeNew(true);
        }
    })

    useEffect(() => {

        if (!address) {
            return;
        }

        if (assumeNew === true) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log("invite code: ", code);
            if (code) {
                const invite = async () => {
                    return await writeContract(config, {
                        address: ContractAddress.owlGameAddress,
                        abi: ContractAbi.owlGame,
                        functionName: "handleInviteCode",
                        args: [encodeInviteCode(code)],
                    })
                }
                invite().then(result => {
                    console.log("invite result: ", result);
                })
            }
        }

        const isApproveForAll = async () => {
            return await readContracts(config, {
                contracts: [
                    {
                        address: ContractAddress.genOneBoxAddress,
                        abi: ContractAbi.genOneBox,
                        functionName: "isApprovedForAll",
                        args: [address, ContractAddress.owlGameAddress],
                    },
                ],
            })
        }
        isApproveForAll().then(result => {
            setIsApprove(result[0].result);
        })

        getData.getUserInfo(address).then(result => {
            console.log("user info result: ", result);
            result.code === 0 && setUserInfo(result.data);
        })

        getData.getUserOwldinals(address, 1, 100).then(result => {
            console.log("user owldinals result: ", result);
            result.code === 0 && setUserOwldinals(result.data);
        })

        getData.getUserBoxes(address, 1, 100).then(result => {
            console.log("user boxes result: ", result);
            result.code === 0 && setUserFruitAndELf(result.data);
        })

    }, [address, hash]);

    function encodeInviteCode(inviteCode) {
        if (inviteCode.length !== 5) {
            throw new Error("Invalid invite code length");
        }
        let encoded = 0;
        for (let i = 0; i < 5; i++) {
            let char = inviteCode[i];
            let charValue = char.charCodeAt(0) - 0x41;
            encoded |= (charValue << (i * 5));
        }
        return encoded;
    }

    const stake = async (type, id) => {

        if (!address || !userInfo) {
            return;
        }

        if (!isApprove) {

            const hash = await writeContract(config, {
                address: ContractAddress.genOneBoxAddress,
                abi: ContractAbi.genOneBox,
                functionName: "setApproveForAll",
            })

            const approveResult = await getTransactionReceipt(config, {hash: hash});
            console.log("approve result: ", approveResult.toString())

            if (approveResult.status === "success") {
                setIsApprove(true);
            }

        }

        const list = id >= 0 ? [id] : type === 1 ? userInfo.elf_info.unstaked_id_list : userInfo.fruit_info.unstaked_id_list

        const hash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "stakeMysteryBox",
            args: [list]
        })

        const stakeResult = await getTransactionReceipt(config, {hash: hash});
        if (stakeResult.status === "success") {
            setHash(hash);
            console.log("stake result: ", stakeResult);
        }

    }

    const claim = async (type, id) => {

        if (!address || !userInfo) {
            return;
        }

        const list = id >= 0 ? [id] : type === 1 ? userInfo.elf_info.unstaked_id_list : userInfo.fruit_info.unstaked_id_list

        const hash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "claimAndUnstakeMysteryBox",
            args: [list]
        })

        const claimResult = await getTransactionReceipt(config, {hash: hash});
        if (claimResult.status === "success") {
            setHash(hash);
            console.log("claim result: ", claimResult);
        }

    };

    const stakeNFT = async (id) => {

        if (!address || !userOwldinals) {
            return;
        }

        const approveHash = await writeContract(config, {
            address: ContractAddress.owldinalNftAddress,
            abi: ContractAbi.owldinalNft,
            functionName: "setApprovalForAll",
            args: [ContractAddress.owlGameAddress, true]
        })

        const approveResult = await getTransactionReceipt(config, {hash: approveHash});
        console.log("approve result: ", approveResult)

        const hash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "stakeOwldinalNft",
            args: [id]
        })

        const stakeResult = await getTransactionReceipt(config, {hash: hash});
        if (stakeResult.status === "success") {
            setHash(hash);
            console.log("stake NFT result: ", stakeResult);
        }

    }

    const claimNFT = async (id) => {

        if (!address || !userOwldinals) {
            return;
        }

        const hash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "unstakeOwldinalNft",
            args: [id]
        })

        const unstakeResult = await getTransactionReceipt(config, {hash: hash});
        if (unstakeResult.status === "success") {
            setHash(hash);
            console.log("unstake NFT result: ", unstakeResult);
        }

    }

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
                                    style={{margin: "0 8px 0 0px"}}>{address ? (address.slice(0, 6) + "..." + address.slice(-4)) : "Please connect your wallet"}
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
                                                        text={"APR: " + addCommaInNumber(userInfo["elf_info"]["apr"]) + "%" || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["elf_info"]["staked"]}/{userInfo["elf_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text="Stake All"
                                        style={{width: "100%", marginTop: "24px"}}
                                        func={() => stake(1, -1)}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text="Claim All"
                                        style={{width: "100%", marginTop: "8px"}}
                                        func={() => claim(1, -1)}
                                    />
                                </div>

                                <div className="infoItem2" style={{textAlign: "center"}}>
                                    <div className="flexBetween">
                                        <div className="text5">Magic Fruit</div>
                                        <ArrowAndNumber arrow={userInfo["fruit_info"]["apr"] >= 0 ? 1 : 0}
                                                        text={"APR: " + addCommaInNumber(userInfo["fruit_info"]["apr"]) + "%" || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["fruit_info"]["staked"]}/{userInfo["fruit_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text="Stake All"
                                        style={{width: "100%", marginTop: "24px"}}
                                        func={() => stake(2, -1)}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text="Claim All"
                                        style={{width: "100%", marginTop: "8px"}}
                                        func={() => claim(2, -1)}
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
                                    func={async () => {
                                        if (!address || !userInfo || userInfo["referral_rewards"]["available"] <= 0) {
                                            return;
                                        }
                                        const hash = await writeContract(config, {
                                            address: ContractAddress.owlGameAddress,
                                            abi: ContractAbi.owlGame,
                                            functionName: "claimInviterReward",
                                        })

                                        const rewardsResult = await getTransactionReceipt(config, {hash: hash});
                                        if (rewardsResult.status === "success") {
                                            setHash(hash);
                                            console.log("rewards result: ", rewardsResult);
                                        }
                                    }}
                                />

                                <div className="flexBetween" style={{margin: "32px 0 8px"}}>
                                    <div className="text3">Invitation link</div>
                                    <div className="text6">Invite list ({userInfo["invite_count"]})</div>
                                </div>

                                <div className="flexBetween linkInfo">
                                    <div className="text5" style={{marginRight: "10px"}}>
                                        {"https://owltest.owldinal.xyz/my?code=" + userInfo["invitation_code"]}
                                    </div>
                                    <img src={copy} width="12" alt=""
                                         onClick={() => copyOnClick("https://owltest.owldinal.xyz/my?code=" + userInfo["invitation_code"])}/>
                                </div>
                            </div>

                        </div>
                        <div className="tableWrapper">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Treasury Revenue" key="1">
                                    <div className="tableItem flexBetween tableHeaderItem">
                                        <div className="tableHeaderItem" style={{width: '136px'}}>NFT</div>
                                        <div className="tableHeaderItem" style={{width: '132px'}}>Earning</div>
                                        <div className="tableHeaderItem" style={{width: '37px'}}>APR</div>
                                        <div className="tableHeaderItem" style={{width: '56px'}}>Status</div>
                                        <div className="tableHeaderItem" style={{width: '78px'}}>Operate</div>
                                    </div>

                                    <div style={{overflowY: "scroll", height: "770px"}}>
                                        {userFruitAndELf && (userFruitAndELf.list.map((item, index) => {
                                            const {token_id, box_type, earning, apr, is_staking} = item;
                                            return <BoxRow key={index} token_id={token_id} box_type={box_type}
                                                           earning={earning} apr={apr}
                                                           is_staking={is_staking}
                                                           func={is_staking ? (() => claim(0, token_id)) : (() => stake(0, token_id))}/>
                                        }))}
                                    </div>

                                </TabPane>
                                <TabPane tab="My Owldinal" key="2">
                                    <div style={{height: "100%"}}>

                                        <div className="tableItem flexBetween tableHeaderItem">
                                            <div className="tableHeaderItem" style={{width: '40%'}}>NFT</div>
                                            <div className="tableHeaderItem" style={{width: '40%'}}>Status</div>
                                            <div className="tableHeaderItem" style={{width: '10%'}}>Operate</div>
                                        </div>

                                        <div style={{overflowY: "scroll", height: "770px"}}>
                                            {userOwldinals && (userOwldinals.list.map((item, index) => {
                                                const {token_id, token_url, is_staking} = item;
                                                return <OwlRow key={index} token_id={token_id} token_url={token_url}
                                                               is_staking={is_staking}
                                                               func={is_staking ? (() => claimNFT([token_id])) : (() => stakeNFT([token_id]))}/>
                                            }))}
                                        </div>
                                        ¬
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
