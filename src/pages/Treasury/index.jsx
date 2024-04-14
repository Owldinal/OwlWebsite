import { useState, useEffect } from "react";
import "./index.css";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import box from "@/assets/box.png";
import share from "@/assets/share.png";
import * as echarts from "echarts";

import { Input } from "antd";
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { coin, ContractAbi, ContractAddress, getData } from "@/config.js";
import { addCommaInNumber } from "@/util.js";
import DisplayBlock from "@components/DisplayBlock.jsx";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { readContracts } from "@wagmi/core";
import { config } from "@/main.jsx";
import Popup from "@components/Popup/index.jsx"

function App(props) {

    const {contractAddress, targetChain} = props;
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {isConnected, address, chain} = useAccount();
    const [inputValue, setInputValue] = useState("");
    const [viewOption, setViewOption] = useState(1);
    const [targetHash, setTargetHash] = useState("");
    const [modelText, setModelText] = useState("Approve");

    const [show, setShow] = useState(false);
    const [elf, setElf] = useState(0);
    const [magic, setMagic] = useState(0);
    const [nothing, setNothing] = useState(0);

    const [priceUSD, setPriceUSD] = useState(0);
    const [gameInfo, setGameInfo] = useState();
    const [rewardsTrend, setRewardsTrend] = useState();
    const [rewardsRevenue, setRewardsRevenue] = useState();

    const boxPrice = 100000;

    const {data: writeContractHash, writeContract, isPending, error} = useWriteContract()

    useEffect(() => {

        getData.getGameInfo().then(result => {
            setGameInfo(result.data);
            console.log("gameInfo: ", result)
        });

        getData.getRewardsTrend().then(result => {
            setRewardsTrend(result.data);
            console.log("rewardsTrend: ", result)
        })

        getData.getRewardsHistory(0, 20).then(result => {
            setRewardsRevenue(result.data);
            console.log("rewardsRevenue: ", result)
        })

        getData.getPriceUSD().then(result => {
            setPriceUSD(result);
            console.log("priceUSD: ", result)
        })

    }, [])

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

        setModelText("Confirming...");

        await writeContract({
            address: ContractAddress.owlGameAddress,
            abi: ContractAbi.owlGame,
            functionName: 'mintMysteryBox',
            args: [
                BigInt(inputValue)
            ],
        })

    }

    const approveOwlToken = async () => {

        if (!isConnected) {
            openConnectModal();
        }

        setModelText("Confirming...");

        await writeContract({
            address: ContractAddress.owlTokenAddress,
            abi: ContractAbi.owlToken,
            functionName: 'approve',
            args: [
                ContractAddress.owlGameAddress,
                BigInt(inputValue * boxPrice) * 10n ** 18n
            ],
        });

    };

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        data: receipt
    } = useWaitForTransactionReceipt({hash: writeContractHash})

    useEffect(() => {

        if (receipt && receipt.logs[0].topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {

            let count = [0, 0, 0, 0];
            const logs = receipt.logs;
            for (let i = 1; i < logs.length; i++) {
                if (logs[i].topics[0] === "0x4cce2d7ca388465a90e71f76235d389abe1ede028b09c07d4f86519e5adb078c") {
                    const tokenId = Number(parseInt(logs[i].data.slice(2, 66), 16))
                    const boxType = Number(parseInt(logs[i].data.slice(66), 16));
                    // console.log("tokenId: ", tokenId, "boxType: ", boxType);
                    count[boxType]++;
                }
            }

            setShow(true);
            setElf(count[1]);
            setMagic(count[2]);
            setNothing(count[3]);

        }

    }, [receipt])

    useEffect(() => {

        const owlTokenAllowance = async () => {
            return await readContracts(config, {
                contracts: [
                    {
                        address: ContractAddress.owlTokenAddress,
                        abi: ContractAbi.owlToken,
                        functionName: 'allowance',
                        args: [address, ContractAddress.owlGameAddress]
                    },
                ],
            })
        }

        owlTokenAllowance().then(result => {
            // console.log("result: ", result);
            const allowance = result[0].result;
            const canMintAndOpenBox = allowance > 0 && (allowance >= BigInt(inputValue * boxPrice) * 10n ** 18n);
            setModelText(isPending ? "Confirming..." : canMintAndOpenBox ? "Mint" : "Approve")
        })

    }, [inputValue, receipt])

    const initChart = ({data}) => {

        if (!data) {
            return;
        }
        // console.log("data: ", data);

        let chartDom = document.getElementById("chart");
        let myChart = echarts.init(chartDom);

        // date process here
        const timeline = data.map(item => {
            const date = new Date(item.date);
            return viewOption === 1 ? date.getDay() : date.getDate();
        });
        const totalPoolAmount = data.map(item => item.total_pool_amount);
        const allocatedRewards = data.map(item => item.allocated_rewards);

        // console.log("timeline: ", timeline, "totalPoolAmount: ", totalPoolAmount, "allocatedRewards: ", allocatedRewards);

        let option;

        option = {
            xAxis: {
                type: "category",
                // data: ["May 5", "May 6", "May 7", "May 8", "May 9", "May 10", "May 11"],
                data: timeline,
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                type: "value",
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: ["#191919"],
                    },
                },
            },
            grid: {
                borderColor: "#8C919F",
                top: '15%',
                left: '15%',
                right: '5%',
                bottom: '10%',
            },
            series: [
                {
                    // data: [110, 150, 155, 170, 200, 130, 120],
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
                    // data: [100, 130, 165, 120, 180, 100, 100],
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
        };

        option && myChart.setOption(option);

        window.onresize = function () {
            myChart.resize();
        };
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
            <TopHeader targetChain={targetChain}/>

            <div className="flexStart">
                <Sider/>
                <div className="treasuryContent">
                    <div className="infoCard flexBetween flexC">

                        {gameInfo && (<div class='leftInfo'>

                            <div className="text1">Total Rewards</div>
                            <div className="text2">
                                {addCommaInNumber(gameInfo["total_rewards"])}<span>{coin}</span>
                            </div>
                            {priceUSD && (
                                <div className="text3">{addCommaInNumber(priceUSD.pairs[0].priceUsd) + " USD"}</div>
                            )}

                            <div className="flexBetween flexW" style={{marginTop: "36px"}}>
                                <DisplayBlock content={gameInfo["owl_price"]} title={"Owl Price"}/>
                                <DisplayBlock content={gameInfo["total_market_cap"]} title={"Total Marketcap"}
                                              change={gameInfo["total_market_cap_change"]}/>
                                <DisplayBlock content={gameInfo["total_burned"]} title={"Total Burn"}
                                              change={gameInfo["total_burned_change"]}/>
                            </div>

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
                                     onClick={() => setInputValue((inputValue * 5).toString())}>x5
                                </div>
                                <div className={"text6"} style={{cursor: "pointer"}}
                                     onClick={() => setInputValue((inputValue * 10).toString())}>x10
                                </div>
                                {/*<div className={"text6"} style={{cursor: "pointer"}}*/}
                                {/*     onClick={() => setInputValue((inputValue * 100).toString())}>x100*/}
                                {/*</div>*/}
                            </div>
                            <Input
                                placeholder="Enter Amount"
                                // type="number"
                                size="large"
                                style={{margin: "12px 0"}}
                                value={inputValue}
                                onChange={(e) => {
                                    const v = Math.ceil(Number(e.target.value));
                                    if (!isNaN(v)) {
                                        setInputValue(v.toString());
                                    } else {
                                        setInputValue("0");
                                    }
                                }}
                            />

                            <div className="flexBetween" style={{width: "100%"}}>
                                <div className="text5">{inputValue * boxPrice} {coin} < /div>
                                <div className="text6"></div>
                            </div>

                            {show && (
                                <Popup elf={elf} nothing={nothing} magic={magic} handleClose={() => {
                                    setShow(false);
                                    setModelText("Approve");
                                    setElf(0);
                                    setMagic(0);
                                    setNothing(0);
                                }}/>)}

                            <OwlButton
                                text={modelText}
                                size="big"
                                style={{width: "100%", marginTop: "24px"}}
                                func={modelText === "Mint" ? mintAndOpenBox : modelText === "Approve" ? approveOwlToken : null}
                            />

                        </div>
                        <div className="tableWrapper">
                            <div className="text1" style={{marginBottom: "16px"}}>
                                Treasury Revenue
                            </div>

                            <div style={{overflowY: "scroll", height: "400px"}}>
                                {(rewardsRevenue && rewardsRevenue.list) && (rewardsRevenue.list.map((item, index) => {
                                    let {address, amount, count, description, operation, transaction_hash} = item;
                                    return (
                                        <>
                                            <a href={"https://scan.merlinchain.io/tx/" + transaction_hash}
                                               target={"_blank"} style={{textDecoration: 'none'}}>
                                                <div className="tableItem flexBetween" key={index}>
                                                    <div
                                                        style={{width: "18%"}}>{address.slice(0, 6)}...{address.slice(-4)}</div>
                                                    <div style={{width: "15%"}}>{amount}</div>
                                                    <div style={{width: "15%"}}>{operation}</div>
                                                    <div style={{width: "15%"}}>{count}</div>
                                                    <div style={{width: "40%"}}>{description}</div>
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
                                        </>
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
