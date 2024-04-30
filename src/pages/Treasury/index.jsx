import { useState, useEffect } from "react";
import "./index.css";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import box from "@/assets/box.png";
import share from "@/assets/share.png";
import * as echarts from "echarts";
import elf_mini from "@/assets/elf_mini.png";
import fruit_mini from "@/assets/fruit_mini.png";

import { Input } from "antd";
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { coin, ContractAbi, ContractAddress, getData } from "@/config.js";
import { addCommaInNumber } from "@/util.js";
import DisplayBlock from "@components/DisplayBlock.jsx";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
    getTransactionConfirmations,
    getTransactionReceipt,
    readContracts,
    waitForTransactionReceipt,
    writeContract
} from "@wagmi/core";
import { config } from "@/main.jsx";
import Popup from "@components/Popup/index.jsx"

function App(props) {

    const {contractAddress, targetChain} = props;
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {isConnected, address, chain} = useAccount();
    const [inputValue, setInputValue] = useState("");
    const [viewOption, setViewOption] = useState(1);
    const [targetHash, setTargetHash] = useState("");
    const [modelText, setModelText] = useState("Mint");

    const [show, setShow] = useState(false);
    const [elf, setElf] = useState(0);
    const [magic, setMagic] = useState(0);
    const [nothing, setNothing] = useState(0);

    const [priceUSD, setPriceUSD] = useState();
    const [gameInfo, setGameInfo] = useState();
    const [rewardsTrend, setRewardsTrend] = useState();
    const [rewardsRevenue, setRewardsRevenue] = useState();
    const [myRewards, setMyRewards] = useState(0);

    const boxPrice = 100_000;

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
                    const [temp] = data;
                    console.log("balance: ", temp);
                    if (temp && temp.result) {
                        const balanceBigInt = BigInt(temp.result);
                        const balance = (balanceBigInt / BigInt(10 ** 18)).toString();
                        setBalance(balance);
                    }
                }
            })
        }
        // setBalance("100000000")
    }, [isConnected, address, show])

    useEffect(() => {

        getData.getGameInfo().then(result => {
            setGameInfo(result.data);
            console.log("gameInfo: ", result)
        });

        getData.getRewardsTrend().then(result => {
            setRewardsTrend(result.data);
            console.log("rewardsTrend: ", result)
        })

        getData.getRewardsHistory(0, 1000, myRewards === 1 ? address : "").then(result => {
            setRewardsRevenue(result.data);
            console.log("rewardsRevenue: ", result)
        })

        getData.getPriceUSD().then(result => {
            setPriceUSD(result);
            console.log("priceUSD: ", result)
        })

    }, [show])

    useEffect(() => {
        getData.getRewardsHistory(0, 1000, myRewards === 1 ? address : "").then(result => {
            setRewardsRevenue(result.data);
            console.log("rewardsRevenue: ", result)
        })
    }, [myRewards])

    useEffect(() => {

        if (!rewardsTrend) {
            return;
        }

        if (viewOption === 1) {
            initChart(rewardsTrend.daily);
        } else if (viewOption === 2) {
            initChart(rewardsTrend.weekly);
        } else if (viewOption === 3) {
            initChart(rewardsTrend.monthly);
        }

    }, [viewOption, rewardsTrend])

    const mintAndOpenBox = async () => {

        if (!isConnected) {
            openConnectModal();
            return;
        }
        if (!inputValue || inputValue <= 0) {
            return;
        }
        setModelText("Confirming...");

        const hasAllowance = await readContracts(config, {
            contracts: [
                {
                    address: ContractAddress.owlTokenAddress,
                    abi: ContractAbi.owlToken,
                    functionName: 'allowance',
                    args: [
                        address,
                        ContractAddress.owlGameAddress
                    ],
                },
            ],
        })
        console.log("hasAllowance: ", hasAllowance[0].result);
        console.log("inputValue: ", BigInt(inputValue * boxPrice) * (10n ** 18n));

        if (BigInt(hasAllowance[0].result) < (BigInt(inputValue * boxPrice) * (10n ** 18n))) {

            const approveHash = await writeContract(config, {
                address: ContractAddress.owlTokenAddress,
                abi: ContractAbi.owlToken,
                functionName: 'approve',
                args: [
                    ContractAddress.owlGameAddress,
                    BigInt(inputValue * boxPrice) * 10n ** 18n
                ],
                // 20000 = 2BTC
                // gas: 100000n,
                // gasPrice: 1000000000n,
            });

            const approveResult = await waitForTransactionReceipt(config, {hash: approveHash, pollingInterval: 1_000,});
            console.log("approve owl result: ", approveResult)

        }

        const requestMintHash = await writeContract(config, {
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: 'requestMint',
            args: [
                BigInt(inputValue)
            ],
            // gas: 1000000n,
            // gasPrice: 10000000000n,
        })
        console.log("request hash: ", requestMintHash)

        const requestMintResult = await waitForTransactionReceipt(config, {
            hash: requestMintHash,
            pollingInterval: 1_000,
        });
        console.log("request mint result: ", requestMintResult)

        setModelText("Waiting for the box to open");
        const mintHash = await waitForMintHash(requestMintHash)
        console.log("mintHash: ", mintHash)
        if (!mintHash) {
            setModelText("Mint")
            return;
        }

        const mintResult = await waitForTransactionReceipt(config, {hash: mintHash, pollingInterval: 1_000,})

        if (mintResult && mintResult.status === "success" && mintResult.logs[0].topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {

            let count = [0, 0, 0, 0];
            const logs = mintResult.logs;
            for (let i = 1; i < logs.length; i++) {
                if (logs[i].topics[0] === "0x4cce2d7ca388465a90e71f76235d389abe1ede028b09c07d4f86519e5adb078c") {
                    const tokenId = Number(parseInt(logs[i].data.slice(2, 66), 16))
                    const boxType = Number(parseInt(logs[i].data.slice(66), 16));
                    // console.log("tokenId: ", tokenId, "boxType: ", boxType);
                    count[boxType]++;
                }
            }

            setElf(count[1]);
            setMagic(count[2]);
            setNothing(count[3]);
            setShow(true);

        }

    }

    const waitForMintHash = async (requestMintHash) => {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                const interval = setInterval(async () => {

                    const result = await getData.getMintHash(requestMintHash)
                    console.log("wait for mint hash result:", result)
                    if (result.code === 0 && result.data.mint_tx.length > 0) {
                        clearInterval(interval);
                        resolve(result.data.mint_tx)
                    }

                }, 1000)

                setTimeout(() => {
                    console.log("wait for mint hash timeout");
                    clearInterval(interval);
                    resolve()
                }, 30000)

            }, 15000)

        })

    }

    useEffect(() => {

        if (!isConnected || !address) {
            return;
        }

        const canMintAndOpenBox = balance >= 0 && (BigInt(balance) >= BigInt(inputValue * boxPrice));
        setModelText(canMintAndOpenBox ? "Mint" : "Not enough Owl");

    }, [inputValue])

    const initChart = ({data}) => {

        if (!data) {
            return;
        }
        // console.log("data: ", data);

        // date process here
        const timeline = data.map(item => {
            const date = new Date(item.date);
            return viewOption === 1 ? date.getDay() : date.getDate();
        });
        const totalPoolAmount = data.map(item => item.total_pool_amount);
        const allocatedRewards = data.map(item => item.allocated_rewards);

        // console.log("timeline: ", timeline, "totalPoolAmount: ", totalPoolAmount, "allocatedRewards: ", allocatedRewards);

        let myChart = echarts.init(document.getElementById("chart"));
        myChart.setOption({
            xAxis: {
                type: "category",
                data: timeline,
                axisTick: {
                    show: false,
                },
            },
            yAxis: [{
                // name: "Treasury",
                type: "value",
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 10
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: ["#191919"],
                    },
                },
            }, {
                // name: "Daily Rewards",
                type: "value",
                axisTick: {
                    show: false,
                },
                max: 5000_0000,
                axisLabel: {
                    textStyle: {
                        fontSize: 10
                    },
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: "dashed",
                        color: ["#191919"],
                    }
                }
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: true,
                    label: {
                        backgroundColor: '#505765'
                    }
                },
            },
            color: ["#55B76E", "#E0A238"],
            legend: {
                data: ["Treasury", "Daily Rewards"],
                textStyle: {
                    fontSize: 12,
                    // font: "BIG SHOT",
                    color: "#8C919F",
                },
                itemWidth: 10,
                itemHeight: 10,
                lineStyle: {
                    width: 0
                }
            },
            grid: {
                borderColor: "#8C919F",
                top: '15%',
                left: '15%',
                right: '15%',
                bottom: '10%',
            },
            series: [
                {
                    name: "Treasury",
                    data: totalPoolAmount,
                    type: "line",
                    symbol: "none",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#55B76E",
                            },
                        },
                    },
                },
                {
                    name: "Daily Rewards",
                    yAxisIndex: 1,
                    data: allocatedRewards,
                    type: "line",
                    symbol: "none",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#E0A238",
                            },
                        },
                    },
                },
            ],
        });

        window.onresize = function () {
            myChart.resize();
        };

        myChart.resize();
    };

    // useEffect(() => {
    //
    //     // console.log("writeContract: ", writeContractHash);
    //     // console.log("isPending: ", isPending);
    //     // console.log("isConfirmed: ", isConfirmed);
    //     // console.log("isConfirming: ", isConfirming);
    //     // console.log("receipt: ", receipt);
    //     // console.log("error: ", error);
    //     console.log("gameInfo: ", gameInfo);
    //     console.log("rewardsTrend: ", rewardsTrend);
    //     console.log("rewardsRevenue: ", rewardsRevenue);
    //
    // }, [writeContractHash, isPending, isConfirmed, isConfirming, receipt, error, gameInfo, rewardsTrend, rewardsRevenue])

    return (
        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain} balance={balance}/>

            <div className="flexStart">
                <Sider/>
                <div className="treasuryContent" style={{flexWrap: "wrap"}}>
                    <div className="infoCard flexBetween flexC">

                        {gameInfo && (<div className='leftInfo'>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}>
                                <div>
                                    <div className="text1">Total Rewards</div>
                                    <div className="text2">
                                        {addCommaInNumber(gameInfo["total_rewards"])}<span>{coin}</span>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row", alignItems: "start"}}>
                                    <div style={{marginRight: "5px", marginTop: "5px"}}>{"Staked "}</div>
                                    <div className={"countTab"}>
                                        <img src={elf_mini} alt={""} width={"20px"}/>
                                        <div className={"text5"}
                                             style={{marginLeft: "5px"}}> {"x " + (gameInfo["staked_elf_count"])}</div>
                                    </div>
                                    <div className={"countTab"} style={{marginRight: "10px"}}>
                                        <img src={fruit_mini} alt={""} width={"20px"}/>
                                        <div className={"text5"}
                                             style={{marginLeft: "5px"}}> {"x " + (gameInfo["staked_fruit_count"])}</div>
                                    </div>
                                </div>

                            </div>
                            {(priceUSD && priceUSD.pairs && priceUSD.pairs[0] && priceUSD.pairs[0].priceUsd) && (
                                <>
                                    <div
                                        className="text3">{addCommaInNumber(Number(priceUSD.pairs[0].priceUsd) * Number(gameInfo["total_rewards"]), true) + " USD"}</div>

                                    <div className="flexBetween flexW" style={{marginTop: "36px"}}>
                                        <DisplayBlock
                                            content={addCommaInNumber(Number(priceUSD.pairs[0].priceUsd), true)}
                                            title={"Owl Price"}/>
                                        <DisplayBlock
                                            content={addCommaInNumber(Number(gameInfo["total_market_cap"]) * Number(priceUSD.pairs[0].priceUsd))}
                                            title={"Total Marketcap"}/>
                                        <DisplayBlock content={addCommaInNumber(Number(gameInfo["total_burned"]))}
                                                      title={"Total Burn"}
                                                      change={gameInfo["total_burned_change"]}/>
                                    </div>
                                </>
                            )}

                        </div>)}

                        <div className="rightInfo" style={{flex: 1, height: "auto", marginLeft: '12px'}}>

                            <div className="flexBetween">
                                <div style={{fontSize: '16px'}}>
                                    Daily Rewards
                                </div>
                                <div className="flexStart">
                                    <div className={"acbtn" + (viewOption === 1 ? " activeAcbtn" : "")}
                                         onClick={() => setViewOption(1)}>Day
                                    </div>
                                    <div className={"acbtn" + (viewOption === 2 ? " activeAcbtn" : "")}
                                         onClick={() => setViewOption(2)}
                                         style={{margin: '0 6px'}}>Week
                                    </div>
                                    <div className={"acbtn" + (viewOption === 3 ? " activeAcbtn" : "")}
                                         onClick={() => setViewOption(3)}>Month
                                    </div>
                                </div>
                            </div>

                            <div id="chart" style={{width: "100%", height: "200px"}}></div>

                        </div>
                    </div>
                    <div className="flexBetween flexC" style={{margin: "24px 0"}}>
                        <div className="infoCard flexColumnStart inputCard">
                            <img src={box} width="128" alt=""/>
                            <div className="text4" style={{margin: "24px 0 32px"}}>
                                Gen 1 Blind Box
                            </div>
                            <div className="flexBetween" style={{width: "100%"}}>
                                <div className="text5">Amount</div>
                                <div className={"text6"} style={{cursor: "pointer"}}
                                     onClick={() => setInputValue("5")}>x5
                                </div>
                                <div className={"text6"} style={{cursor: "pointer"}}
                                     onClick={() => setInputValue("10")}>x10
                                </div>
                                <div className={"text6"} style={{cursor: "pointer"}}
                                     onClick={() => setInputValue("20")}>x20
                                </div>
                                {/*<div className={"text6"} style={{cursor: "pointer"}}*/}
                                {/*     onClick={() => setInputValue((inputValue * 100).toString())}>x100*/}
                                {/*</div>*/}
                            </div>
                            <Input
                                placeholder="Enter Amount ( x20 max )"
                                // type="number"
                                size="large"
                                style={{margin: "12px 0"}}
                                value={inputValue}
                                onChange={(e) => {
                                    const v = Math.ceil(Number(e.target.value));
                                    if (!isNaN(v)) {
                                        setInputValue(v > 20 ? "20" : v.toString());
                                    } else {
                                        setInputValue("0");
                                    }
                                }}
                            />

                            <div className="flexBetween" style={{width: "100%"}}>
                                <div className="text5">{addCommaInNumber(inputValue * boxPrice)} {coin} < /div>
                                <div className="text6"></div>
                            </div>

                            {show && (
                                <Popup elf={elf} nothing={nothing} magic={magic} handleClose={() => {
                                    setShow(false);
                                    setModelText("Mint");
                                    setElf(0);
                                    setMagic(0);
                                    setNothing(0);
                                }}/>)}

                            <OwlButton
                                text={modelText}
                                size="big"
                                style={{width: "100%", marginTop: "24px"}}
                                func={modelText === "Mint" ? mintAndOpenBox : null}
                            />

                        </div>
                        <div className="tableWrapper">

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div className="text1" style={{marginBottom: "16px"}}>
                                    Treasury Revenue
                                </div>
                                <OwlButton style={{height: "30px", marginRight: "8px", marginBottom: "8px"}}
                                           text={"My"} size={"middle"} type={myRewards === 1 ? "primary" : "dark"}
                                           func={() => address && setMyRewards((myRewards + 1) % 2)}/>
                            </div>

                            <div style={{overflowY: "scroll", height: "400px"}}>
                                {(rewardsRevenue && rewardsRevenue.list) && (rewardsRevenue.list.map((item, index) => {
                                    let {address, amount, count, description, operation, transaction_hash} = item;
                                    return (
                                        <div key={index}>
                                            <a href={"https://scan.merlinchain.io/tx/" + transaction_hash}
                                               target={"_blank"} style={{textDecoration: 'none'}}>
                                                <div className="tableItem flexBetween">
                                                    <div
                                                        style={{width: "28%"}}>{address.slice(0, 6)}...{address.slice(-4)}</div>
                                                    <div style={{width: "15%"}}>{amount}</div>
                                                    <div style={{width: "15%"}}>{operation}</div>
                                                    <div style={{width: "10%"}}>{count}</div>
                                                    <div style={{width: "30%"}}>{"Gen 1 Blind Box"}</div>
                                                    <div
                                                        style={{width: "18%"}}>{transaction_hash.slice(0, 6)}...{transaction_hash.slice(-4)}</div>
                                                    <div>
                                                        <img
                                                            src={share}
                                                            width="14"
                                                            alt=""
                                                            style={{cursor: "pointer"}}
                                                        />
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    )
                                }))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
