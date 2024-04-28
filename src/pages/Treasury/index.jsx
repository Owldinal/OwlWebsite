import { useState, useEffect } from "react";
import "./index.css";
import cn from "classnames";
import OwlButton from "@/components/Button/index.jsx";
import TopHeader from "@/components/TopHeader/index.jsx";
import Sider from "@/components/Sider/index.jsx";
import arrup from "@/assets/arrup.png";
import arrdown from "@/assets/arrdown.png";
import box from "@/assets/box.png";
import share from "@/assets/share.png";
import * as echarts from "echarts";

import { Input } from "antd";

function App() {
  useEffect(() => {
    initChart();
  });

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

  const initChart = () => {
    var chartDom = document.getElementById("chart");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      xAxis: {
        type: "category",
        data: ["May 5", "May 6", "May 7", "May 8", "May 9", "May 10", "May 11"],
        axisTick: {
          show: false, //不显示坐标轴线
        },
      },
      yAxis: {
        type: "value",
        axisTick: {
          show: false, //不显示坐标轴刻度线
        },
        // axisLine: {
        //   show: false, //不显示坐标轴线
        // },
        // axisLabel: {
        //   show: false, //不显示坐标轴上的文字
        // },
        splitLine: {
          //网格线
          show: true,

          lineStyle: {
            type: "dashed",
            // 使用深浅的间隔色
            color: ["#191919"],
          },
        },
      },
      grid: {
        borderColor: "#8C919F",
        top: '15%',    // 调整顶部的空白
        left: '10%',    // 调整左侧的空白
        right: '5%',   // 调整右侧的空白
        bottom: '10%',
      },
      series: [
        {
          data: [110, 150, 155, 170, 200, 130, 120],
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


    window.onresize = function() {
      // 让图表的容器自适应window的大小
      myChart.resize();
  };
  };

  return (
    <div className="rootInnerWrapper">
      <TopHeader />
      <div className="flexStart">
        <Sider />
        <div className="treasuryContent">
          <div className="infoCard flexBetween flexC">
            <div class='leftInfo'>
              <div className="text1">Total Rewards</div>
              <div className="text2">
                673,478,598.78<span>owl</span>
              </div>
              <div className="text3">4.728.12455 USD</div>

              <div className="flexBetween flexW mt36">
                <div className="infoItem flexBetweenStart" style={{ marginRight: "16px",marginBottom:'6px' }}>
                  <div>
                    <div className="infoItemText1">0.00762</div>
                    <div className="infoItemText2">Owl Price</div>
                  </div>
                  <div className="infoItemTextUp">
                    <img src={arrup} width="10" alt="" /> 173.43%
                  </div>
                </div>
                <div
                  className="infoItem flexBetweenStart"
                  style={{ marginRight: "16px", marginBottom:'6px' }}
                >
                  <div>
                    <div className="infoItemText1">45,244.87</div>
                    <div className="infoItemText2">Total Marketcap</div>
                  </div>
                  <div className="infoItemTextDown">
                    <img src={arrdown} width="10" alt="" /> 23.48
                  </div>
                </div>
                <div className="infoItem flexBetweenStart" style={{ marginRight: "16px",marginBottom:'6px' }}>
                  <div>
                    <div className="infoItemText1">123,345,789</div>
                    <div className="infoItemText2">Total Burn</div>
                  </div>
                  <div className="infoItemTextUp">
                    <img src={arrup} width="10" alt="" /> 473.43%
                  </div>
                </div>
              </div>
            </div>
            <div className="rightInfo" style={{ flex:1, height: "auto", marginLeft:'12px'}}>
              
              <div className="flexBetween">
                <div style={{fontSize:'16px'}}>
                  Daily Rewards
                </div>
                <div className="flexStart">
                  <div className="acbtn activeAcbtn">Day</div>
                  <div className="acbtn" style={{margin:'0 6px'}}>Week</div>
                  <div className="acbtn">Month</div>

                </div>
              </div>
              <div id="chart" style={{ width: "100%", height: "200px" }} class="chart"></div>
            </div>
          </div>
          <div className="flexBetween flexC" style={{ margin: "24px 0" }}>
            <div className="infoCard flexColumnStart inputCard">
              <img src={box} class='bimg' alt="" />
              <div className="text4 gh">
                Gen 1 Blind Box
              </div>
              <div className="flexBetween" style={{ width: "100%" }}>
                <div className="text5">Amount</div>
                <div className="text6">x5 x10 x100</div>
              </div>
              <Input
                placeholder="Enter Amount"
                size="large"
                style={{ margin: "12px 0" }}
              />
              <div className="flexBetween" style={{ width: "100%" }}>
                <div className="text5">0 Owl</div>
                <div className="text6"></div>
              </div>

              <OwlButton
                text="Mint"
                size="big"
                className='xbtn'
                style={{ width: "100%", marginTop: "24px" }}
              />
            </div>
            <div className="tableWrapper">
              <div className="text1" style={{ marginBottom: "16px" }}>
                Treasury Revenue
              </div>
              {tableData.map((item, index) => {
                let { a, b, c, d, e, f, g } = item;
                return (
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
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
