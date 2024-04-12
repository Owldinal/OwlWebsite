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

function App(props) {

    const {contractAddress, targetChain} = props;
    const {isConnected, address, chain} = useAccount();
    const [inputValue, setInputValue] = useState("");
    const [viewOption, setViewOption] = useState(1);
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const [targetHash, setTargetHash] = useState("");

    const boxPrice = 100000;

    // const {
    //     data: readContract,
    // } = useReadContracts({
    //     contracts: [
    //         {
    //             address: ContractAddress.owlTokenAddress,
    //             abi: ContractAbi.owlToken,
    //             functionName: 'allowance',
    //             args: [address, ContractAddress.owlGameAddress]
    //         },
    //     ],
    // })
    //
    // const {isLoading: isConfirming, isSuccess: isConfirmed, data: receipt} =
    //     useWaitForTransactionReceipt({
    //         targetHash
    //     })
    //
    // const [owlTokenAllowance,] = readContract || [];
    // const canMintAndOpenBox = owlTokenAllowance && owlTokenAllowance >= inputValue * boxPrice;
    //
    // const {data: writeContractHash, writeContract, isPending, error} = useWriteContract()

    const [gameInfo, setGameInfo] = useState({
        total_rewards: 0,
        total_rewards_usd: 0,
        owl_price: 0,
        owl_price_change: 0,
        total_market_cap: 0,
        total_market_cap_change: 0,
        total_burned: 0,
        total_burned_change: 0,
    });
    const [rewardsTrend, setRewardsTrend] = useState({
        daily: [],
        weekly: [],
        monthly: []
    });
    const [rewardsRevenue, setRewardsRevenue] = useState([
        {
            address: "0x1234...5678",
            operation: "minted",
            description: "Gen1 Blind Box",
            count: 0,
            amount: 0,
            transaction_hash: ""
        },
        {
            address: "0x1234...5678",
            operation: "minted",
            description: "Gen1 Blind Box",
            count: 0,
            amount: 0,
            transaction_hash: ""
        }
    ])

    useEffect(() => {

        // getData.getGameInfo().then(result => {
        //     setGameInfo(result);
        // });
        //
        // getData.getRewardsTrend().then(result => {
        //     setRewardsTrend(result);
        // })
        //
        // getData.getRewardsHistory().then(result => {
        //     setRewardsRevenue(result);
        // })

        initChart();

    });

    // useEffect(() => {
    //
    //     if (viewOption === 1) {
    //         initChart(rewardsTrend.daily);
    //     } else if (viewOption === 2) {
    //         initChart(rewardsTrend.weekly);
    //     } else if (viewOption === 3) {
    //         initChart(rewardsTrend.monthly);
    //     }
    //
    // }, [viewOption])

    const tableData = [
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
        {
            a: "0x1234...5678",
            b: "Mintd",
            c: "Gen1 Blind Box",
            d: "x72",
            e: "+ 3,600,600 Owl",
            f: "8194ws...1hd8g2",
        },
    ];

    const initChart = (data) => {
        let chartDom = document.getElementById("chart");
        let myChart = echarts.init(chartDom);

        // date process here
        // const timeline = data.map(item => item.date);
        // const totalPoolAmount = data.map(item => item.totalPoolAmount);
        // const allocatedRewards = data.map(item => item.allocatedRewards);

        let option;

        option = {
            xAxis: {
                type: "category",
                data: ["May 5", "May 6", "May 7", "May 8", "May 9", "May 10", "May 11"],
                // data: timeline,
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
                left: '10%',
                right: '5%',
                bottom: '10%',
            },
            series: [
                {
                    data: [110, 150, 155, 170, 200, 130, 120],
                    // data:totalPoolAmount,
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
                    data: [100, 130, 165, 120, 180, 100, 100],
                    // data: allocatedRewards,
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

    const mintAndOpenBox = async () => {

        if (!isConnected) {
            openConnectModal();
        }

        // await writeContract({
        //     address: ContractAddress.owlGameAddress,
        //     abi: ContractAbi.owlGame,
        //     functionName: 'mintMysteryBox',
        //     args: [
        //         inputValue
        //     ],
        // })
        //
        // console.log("writeContractHash: ", writeContractHash);
        // setTargetHash(writeContractHash);
        // console.log("writeContractHash: ", writeContractHash);

    }

    const approveOwlToken = () => {

        // writeContract({
        //     address: ContractAddress.owlTokenAddress,
        //     abi: ContractAbi.owlToken,
        //     functionName: 'approve',
        //     args: [
        //         ContractAddress.owlGameAddress,
        //         inputValue * boxPrice * 10 ** 18
        //     ],
        // });

    };

    return (
        <div className="rootInnerWrapper">
            <TopHeader targetChain={targetChain}/>
            <div className="flexStart">
                <Sider/>
                <div className="treasuryContent">
                    <div className="infoCard flexBetween flexC">

                        <div class='leftInfo'>

                            <div className="text1">Total Rewards</div>
                            <div className="text2">
                                {addCommaInNumber(gameInfo["total_rewards"])}<span>{coin}</span>
                            </div>
                            <div className="text3">{addCommaInNumber(gameInfo["total_rewards_usd"]) + " USD"}</div>

                            <div className="flexBetween flexW" style={{marginTop: "36px"}}>
                                <DisplayBlock content={gameInfo["owl_price"]} title={"Owl Price"}/>
                                <DisplayBlock content={gameInfo["total_market_cap"]} title={"Total Marketcap"}
                                              change={gameInfo["total_market_cap_change"]}/>
                                <DisplayBlock content={gameInfo["total_burned"]} title={"Total Burn"}
                                              change={gameInfo["total_burned_change"]}/>
                            </div>

                        </div>

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
                                <div className={"text6"} style={{cursor: "pointer"}}
                                     onClick={() => setInputValue((inputValue * 100).toString())}>x100
                                </div>
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

                            <OwlButton
                                text={"Mint"}
                                size="big"
                                style={{width: "100%", marginTop: "24px"}}
                                func={mintAndOpenBox()}
                                // func={canMintAndOpenBox ? mintAndOpenBox() : approveOwlToken()}
                            />

                        </div>
                        <div className="tableWrapper">
                            <div className="text1" style={{marginBottom: "16px"}}>
                                Treasury Revenue
                            </div>

                            <div style={{overflowY: "scroll", height: "400px"}}>
                                {tableData.map((item, index) => {
                                    let {a, b, c, d, e, f, g} = item;
                                    return (
                                        <>
                                            <a href={""} target={"_blank"} style={{textDecoration: 'none'}}>
                                                <div className="tableItem flexBetween" key={index}>
                                                    <div>{a}</div>
                                                    <div>{b}</div>
                                                    <div>{c}</div>
                                                    <div>{d}</div>
                                                    <div>{e}</div>
                                                    <div>{f}</div>
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
                                })}
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
