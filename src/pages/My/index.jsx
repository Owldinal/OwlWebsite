import { Fragment, useEffect, useState } from "react";
import "./index.css";
import cn from "classnames";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import arrup from "@/assets/arrup.png";
import a1 from "@/assets/a1.png";
import i from "@/assets/i.png";
import copy from "@/assets/copy.png";
import copy_success from "@/assets/copy_success.png";
import bage1 from "@/assets/bage1.png";
import bage2 from "@/assets/bage2.png";
import bage3 from "@/assets/bage3.png";
import buff4 from "@/assets/buff4.png";
import gif from "@/assets/owl.gif";
import { useNavigate } from "react-router-dom";

import { Modal, Tabs } from "antd";

import { useAccount } from "wagmi";
import { ContractAbi, ContractAddress, getData } from "@/config.js";
import ArrowAndNumber from "@components/ArrowAndNumber.jsx";
import { addCommaInNumber } from "@/util.js";
import BoxRow from "@components/BoxRow.jsx";
import OwlRow from "@components/OwlRow.jsx";
import { getTransactionReceipt, readContracts, waitForTransactionReceipt, writeContract } from "@wagmi/core";
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
        buff_level: 0,
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
    const [hash, setHash] = useState("");

    const [assumeNew, setAssumeNew] = useState(false);
    const [copySuccess1, setCopySuccess1] = useState(false);
    const [copySuccess2, setCopySuccess2] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [modelText, setModelText] = useState("");
    const [modelButton, setModelButton] = useState(false);
    const [owlGif, setOwlGif] = useState(false);

    const [infoVisible, setInfoVisible] = useState(false);

    const [balance, setBalance] = useState("0");
    useEffect(() => {
        if (!isConnected) {
            setBalance("0");
        } else {
            const balance = async () => {
                return await readContracts(config, {
                    contracts: [
                        {
                            address: ContractAddress.owlTokenAddress,
                            abi: ContractAbi.owlToken,
                            functionName: "balanceOf",
                            args: [address],
                        }
                    ],
                });
            }
            console.log("request balance: ", address);
            balance().then((data) => {
                if (data && data.length > 0) {
                    console.log("balance: ", data);
                    const [temp] = data;
                    if (temp && temp.result) {
                        const balanceBigInt = BigInt(temp.result);
                        const balance = (balanceBigInt / BigInt(10 ** 18)).toString();
                        setBalance(balance);
                    }
                }
            })
        }
    }, [isConnected, address, hash])

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
                        // gas: 100000n,
                        // gasPrice: 1000000000n,
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

        getData.getUserOwldinals(address, 1, 1000).then(result => {
            console.log("user owldinals result: ", result);
            const noMoreStaking = result.data.list.filter((item) => item.is_staking === true).length >= 3;
            console.log("noMoreStaking: ", noMoreStaking);
            result.data.noMoreStaking = noMoreStaking;
            result.code === 0 && setUserOwldinals(result.data);
        })

        getData.getUserBoxes(address, 1, 1000).then(result => {
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

        // return;

        if (!address || !userInfo) {
            return;
        }

        setModelText("")
        setOwlGif(true);
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 3))
        // }, 1000)

        if (!isApprove) {

            const stakeHash = await writeContract(config, {
                address: ContractAddress.genOneBoxAddress,
                abi: ContractAbi.genOneBox,
                functionName: "setApprovalForAll",
                args: [ContractAddress.owlGameAddress, true],
                // gas: 1000000n,
                // gasPrice: 1000000000n,
            })

            const approveResult = await waitForTransactionReceipt(config, {hash: stakeHash, pollingInterval: 1_000,});
            console.log("approve result: ", approveResult.toString())

            if (approveResult.status === "success") {
                setIsApprove(true);
            }

        }

        const list =
            id >= 0 ? [id] :
                type === 1 ? userInfo.elf_info.unstaked_id_list.slice(0, 20)
                    : userInfo.fruit_info.unstaked_id_list.slice(0, 20)

        const stakeHash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "stakeMysteryBox",
            args: [list],
            // gas: 1000000n,
            // gasPrice: 1000000000n,
        })

        const stakeResult = await waitForTransactionReceipt(config, {hash: stakeHash, pollingInterval: 1_000,});
        // clearInterval(interval);
        if (stakeResult.status === "success") {
            setHash(stakeHash);
            setTimeout(() => {
                setHash(stakeHash + "refresh");
            }, 3000)
            console.log("stake result: ", stakeResult);
            setModelText("Success");

        } else {
            setModelText("Something went wrong");

        }
        setOwlGif(false);
        setModelButton(true)

    }

    const claim = async (type, id) => {

        // return;

        if (!address || !userInfo) {
            return;
        }

        setModelText("")
        setOwlGif(true)
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 3))
        // }, 1000)
        //
        const list = id >= 0 ? [id] : type === 1 ? userInfo.elf_info.staked_id_list.slice(0, 20) : userInfo.fruit_info.staked_id_list.slice(0, 20)

        const claimHash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "claimAndUnstakeMysteryBox",
            args: [list],
            // gas: 1000000n,
            // gasPrice: 1000000000n,
        })

        const claimResult = await waitForTransactionReceipt(config, {hash: claimHash, pollingInterval: 1_000,});
        // clearInterval(interval);
        if (claimResult.status === "success") {
            setHash(claimHash);
            setTimeout(() => {
                setHash(claimHash + "refresh");
            }, 3000)
            console.log("claim result: ", claimResult);
            setModelText("Success");
        } else {
            setModelText("Something went wrong");
        }
        setOwlGif(false);
        setModelButton(true)

    };

    const stakeNFT = async (id) => {

        // return;

        if (!address || !userOwldinals) {
            return;
        }

        if (userOwldinals.noMoreStaking === true) {
            setModelText("You cannot stake more than 3 at the same time")
            setModelButton(true)
            setDialogVisible(true);
            return;
        }

        setModelText("")
        setOwlGif(true)
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 3))
        // }, 1000)

        const approveForAll = await readContracts(config, {
            contracts: [{
                address: ContractAddress.owldinalNftAddress,
                abi: ContractAbi.owldinalNft,
                functionName: "isApprovedForAll",
                args: [address, ContractAddress.owlGameAddress],
            }]
        })
        console.log("approveForAll: ", approveForAll);

        if (!approveForAll[0].result) {

            const approveHash = await writeContract(config, {
                address: ContractAddress.owldinalNftAddress,
                abi: ContractAbi.owldinalNft,
                functionName: "setApprovalForAll",
                args: [ContractAddress.owlGameAddress, true],
                // gas: 1000000n,
                // gasPrice: 1000000000n,
            })

            const approveResult = await waitForTransactionReceipt(config, {
                hash: approveHash,
                pollingInterval: 1_000,
            });

            console.log("approve result: ", approveResult)

        }

        const stakeHash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "stakeOwldinalNft",
            args: [id],
            // gas: 1000000n,
            // gasPrice: 1000000000n,
        })

        const stakeResult = await waitForTransactionReceipt(config, {hash: stakeHash, pollingInterval: 1_000,});
        // clearInterval(interval);
        if (stakeResult.status === "success") {
            setHash(stakeHash);
            setTimeout(() => {
                setHash(stakeHash + "refresh");
            }, 3000)
            console.log("stake NFT result: ", stakeResult);
            setModelText("Success");
        } else {
            setModelText("Something went wrong");
        }
        setOwlGif(false);
        setModelButton(true)
    }

    const claimNFT = async (id) => {

        if (!address || !userOwldinals) {
            return;
        }

        setModelText("")
        setOwlGif(true)
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 3))
        // }, 1000)

        let unstakeHash;
        try {
            unstakeHash = await writeContract(config, {
                address: ContractAddress.owlGameAddress,
                abi: ContractAbi.owlGame,
                functionName: "unstakeOwldinalNft",
                args: [id],
                // gas: 1000000n,
                // gasPrice: 1000000000n,
            })
        } catch (e) {
            console.warn(e);
            // clearInterval(interval)
            setModelText("Unstaking Owldinal is only allowed after claiming all rewards.");
            setOwlGif(false)
            setModelButton(true);
            setDialogVisible(true);
            return;
        }

        const unstakeResult = await waitForTransactionReceipt(config, {hash: unstakeHash, pollingInterval: 1_000});
        // clearInterval(interval);
        if (unstakeResult.status === "success") {
            setHash(unstakeHash);
            setTimeout(() => {
                setHash(unstakeHash + "refresh");
            }, 3000)
            console.log("unstake NFT result: ", unstakeResult);
            setModelText("Success");
        } else {
            setModelText("Something went wrong");
        }
        setOwlGif(false);
        setModelButton(true)
    }

    const claimReferralRewards = async () => {
        if (!address || !userInfo || userInfo["referral_rewards"]["available"] <= 0) {
            return;
        }

        setModelText("")
        setOwlGif(true)
        setDialogVisible(true)
        // let i = 0
        // const interval = setInterval(() => {
        //     setModelText("Progress" + ".".repeat(++i % 6))
        // }, 1000)

        const rewardsHash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: "claimInviterReward",
        })

        const rewardsResult = await waitForTransactionReceipt(config, {
            hash: rewardsHash,
            pollingInterval: 1_000,
        });
        // clearInterval(interval)
        if (rewardsResult.status === "success") {
            setHash(rewardsHash);
            setTimeout(() => {
                setHash(rewardsHash + "refresh");
            }, 3000)
            console.log("rewards result: ", rewardsResult);
            setModelText("Success");
        } else {
            setModelText("Something went wrong");
        }
        setOwlGif(false);
        setModelButton(true)
    }

    const copyOnClick = (address, i) => {

        if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(() => {
                console.log('Address copied to clipboard:', address);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
            if (i === 1) {
                setCopySuccess1(true);
                setTimeout(() => {
                    setCopySuccess1(false);
                }, 2000);
            } else if (i === 2) {
                setCopySuccess2(true);
                setTimeout(() => {
                    setCopySuccess2(false);
                }, 2000);
            }
        }

    }

    return (
        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain} balance={balance}/>

            <Modal title={null}
                   open={dialogVisible}
                   footer={null}
                   onOk={() => setDialogVisible(false)}
                   onCancel={() => setDialogVisible(false)}
                   style={{
                       // display: "flex",
                       height: "500px",
                       width: "500px",
                       alignItems: "center",
                       justifyContent: "center",
                       top: "30%",
                       overflow: "auto"
                   }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "300px",
                }}>
                    {owlGif === true && (<div style={{height: "250px"}}><img src={gif} alt=""/></div>)}
                    {modelText && (
                        <div style={{marginBottom: "20px", marginTop: "100px", height: "50%"}}>
                            <h3>{modelText}</h3>
                        </div>
                    )}
                    {modelButton === true && (
                        <OwlButton size={"small"} text={"OK"}
                                   func={() => {
                                       setDialogVisible(false);
                                       setModelButton(false);
                                   }}/>)}
                </div>
            </Modal>

            <Modal title={null}
                   open={infoVisible}
                   footer={null}
                   onOk={() => setInfoVisible(false)}
                   onCancel={() => setInfoVisible(false)}
                   style={{
                       // display: "flex",
                       height: "500px",
                       width: "500px",
                       alignItems: "center",
                       justifyContent: "center",
                       top: "30%",
                       // overflow: "auto"
                   }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "300px",
                }}>
                    <div style={{marginBottom: "20px", height: "50%"}}>
                        <h3>
                            {"Referral rewards are unlocked by minting Gen1 blind boxes. Accumulate n mints to unlock k*n referral rewards:"}<br/>
                            {"- If n ≤ 10, k = 3"}<br/>
                            {"- If 10 < n ≤ 50, k = 5.5"}<br/>
                            {"- If 50 < n ≤ 100, k = 7"}<br/>
                            {"- If n > 100, k = 8.5"}
                        </h3>
                    </div>
                </div>
            </Modal>

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
                                {(address && !copySuccess1) && (
                                    <img src={copy} width="12" alt="" onClick={() => copyOnClick(address, 1)}/>
                                )}
                                {(address && copySuccess1) && (
                                    <img src={copy_success} width="12" alt=""/>
                                )}
                            </div>

                            <div className="text2 ">
                                {addCommaInNumber(userInfo["total_earned"])}<span> Owl</span>
                            </div>

                            <div className="text3">Total Earned</div>

                            <div className="flexStart" style={{margin: "16px 0 32px"}}>
                                <img src={bage1} width="48" alt="" title={"Owl's Protection"}
                                     style={userInfo["buff_level"] >= 1 ? {marginRight: "16px",} : {
                                         marginRight: "16px",
                                         filter: "grayscale(1)"
                                     }}/>
                                <img
                                    src={bage2} width="48" alt="" title={"Owl's Blessing"}
                                    style={userInfo["buff_level"] >= 2 ? {marginRight: "16px",} : {
                                        marginRight: "16px",
                                        filter: "grayscale(1)"
                                    }}
                                />
                                <img src={bage3} width="48" alt="" title={"Owl's Deterrence"}
                                     style={userInfo["buff_level"] >= 3 ? {marginRight: "16px",} : {
                                         marginRight: "16px",
                                         filter: "grayscale(1)"
                                     }}/>
                                <img src={buff4} width="48" alt={""} title={"Moon Boost"}
                                     style={userInfo["is_moon_boost"] === true ? {marginRight: "16px",} : {
                                         marginRight: "16px",
                                         filter: "grayscale(1)"
                                     }}/>
                            </div>

                            <div className="flexBetween flexS">
                                <div className="infoItem2" style={{textAlign: "center", marginRight: '12px'}}>
                                    <div className="flexBetween">
                                        <div className="text5">ELF</div>
                                        <ArrowAndNumber arrow={userInfo["elf_info"]["apr"] >= 0 ? 1 : 0}
                                                        text={"APY: " + addCommaInNumber(userInfo["elf_info"]["apy"]) + "%" || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["elf_info"]["staked"]}/{userInfo["elf_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text={userInfo["elf_info"]["total"] - userInfo["elf_info"]["staked"] <= 20 ? "Stake All" : "Stake 20"}
                                        style={{width: "100%", marginTop: "24px"}}
                                        func={() => stake(1, -1)}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text={userInfo["elf_info"]["staked"] <= 20 ? "Claim All" : "Claim 20"}
                                        style={{width: "100%", marginTop: "8px"}}
                                        func={() => claim(1, -1)}
                                    />
                                </div>

                                <div className="infoItem2" style={{textAlign: "center"}}>
                                    <div className="flexBetween">
                                        <div className="text5">Magic Fruit</div>
                                        <ArrowAndNumber arrow={userInfo["fruit_info"]["apr"] >= 0 ? 1 : 0}
                                                        text={"APY: " + addCommaInNumber(userInfo["fruit_info"]["apy"]) + "%" || "0%"}/>
                                    </div>

                                    <div
                                        className="infoItemText1">{userInfo["fruit_info"]["staked"]}/{userInfo["fruit_info"]["total"]}</div>
                                    <div className="infoItemText2">Staked/Total</div>

                                    <OwlButton
                                        type="dark"
                                        text={userInfo["fruit_info"]["total"] - userInfo["fruit_info"]["staked"] <= 20 ? "Stake All" : "Stake 20"}
                                        style={{width: "100%", marginTop: "24px"}}
                                        func={() => stake(2, -1)}
                                    />
                                    <OwlButton
                                        type="dark"
                                        text={userInfo["fruit_info"]["staked"] <= 20 ? "Claim All" : "Claim 20"}
                                        style={{width: "100%", marginTop: "8px"}}
                                        func={() => claim(2, -1)}
                                    />
                                </div>
                            </div>

                            <div className="infoItem2" style={{margin: "16px 0"}}>
                                <div style={{flexDirection: "row", display: "flex"}}>
                                    <div className="text5" style={{marginBottom: "30px"}}>
                                        Referral Rewards
                                    </div>
                                    <div className={"text5"} style={{marginLeft: "15px", cursor: "pointer"}}
                                         onClick={() => {
                                             setInfoVisible(true)
                                         }}>
                                        <img src={i} alt={""} style={{width: "16px"}}/>
                                    </div>
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
                                    func={claimReferralRewards}
                                />

                                <div className="flexBetween" style={{margin: "32px 0 8px"}}>
                                    <div className="text3">Invitation link</div>
                                    <div className="text6">Invite list ({userInfo["invite_count"]})</div>
                                </div>

                                <div className="flexBetween linkInfo">
                                    <div className="text5" style={{marginRight: "10px"}}>
                                        {"https://owldinal.xyz/my?code=" + userInfo["invitation_code"]}
                                    </div>
                                    {!copySuccess2 &&
                                        <img src={copy} width="12" alt=""
                                             onClick={() => copyOnClick("https://owldinal.xyz/my?code=" + userInfo["invitation_code"], 2)}/>}
                                    {copySuccess2 && <img src={copy_success} width="12" alt=""/>}
                                </div>
                            </div>

                        </div>

                        <div className="tableWrapper">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Treasury Revenue" key="1">
                                    <div className="tableItem flexBetween tableHeaderItem">
                                        <div className="tableHeaderItem" style={{width: '200px'}}>NFT</div>
                                        <div className="tableHeaderItem" style={{width: '100px'}}>Claimed</div>
                                        <div className="tableHeaderItem" style={{width: '100px'}}>Earning</div>
                                        <div className="tableHeaderItem" style={{width: '100px'}}>APR</div>
                                        <div className="tableHeaderItem" style={{width: '80px'}}>Status</div>
                                        <div className="tableHeaderItem" style={{width: '75px'}}>Operate</div>
                                    </div>

                                    <div style={{overflowY: "scroll", height: "770px"}}>
                                        {userFruitAndELf && (userFruitAndELf.list.map((item, index) => {
                                            const {token_id, box_type, claimed, earning, apr, is_staking} = item;
                                            return <BoxRow key={index} token_id={token_id} box_type={box_type}
                                                           claimed={claimed} earning={earning} apr={apr}
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
                                            {userOwldinals && (
                                                userOwldinals.list.map((item, index) => {
                                                    const {token_id, token_url, is_staking} = item;
                                                    return <OwlRow key={index} token_id={token_id}
                                                                   token_url={token_url}
                                                                   is_staking={is_staking}
                                                                   noMoreStaking={userOwldinals.noMoreStaking}
                                                                   func={is_staking ? (() => claimNFT([token_id])) : (() => stakeNFT([token_id]))}/>
                                                })
                                            )}
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
