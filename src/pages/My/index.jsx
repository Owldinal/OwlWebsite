import { useState } from "react";
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


import {  Tabs } from "antd";
const { TabPane } = Tabs;
import { tableData } from "./data.jsx";

function App() {
  const navigate = useNavigate()
  return (
    <div className="rootInnerWrapper">
      <TopHeader />
      <div className="flexStart">
        <Sider />
        <div className="" style={{width:'100%',padding:'16px'}}>
          <div className="flexBetween flexC" >
            <div className="infoCard inputCard width100" style={{ minWidth: "" }}>
              <div className="text1 flexStartCenter">
                <span>
                  <img src={a1} width="48" alt="" className="boderRadius50" />
                </span>{" "}
                <span style={{ margin: "0 8px 0 16px" }}>0x1234...5678</span>{" "}
                <img src={copy} width="12" alt="" />
              </div>

              <div className="text2 ">
                5,271.78<span>owl</span>
              </div>

              <div className="text3">Total Earned</div>

              <div className="flexStart gh2">
                <img src={bage1} width="48" alt="" />
                <img
                  src={bage2}
                  width="48"
                  alt=""
                  style={{ margin: "0 16px" }}
                />
                <img src={bage3} width="48" alt="" />
              </div>
              <div className="flexBetween flexS">
                <div className="infoItem2" style={{ textAlign: "center",marginRight:'12px' }}>
                  <div className="flexBetween">
                    <div className="text5">ELF</div>
                    <div className="infoItemTextUp">
                      <img src={arrup} width="10" alt="" /> APR: 2755%
                    </div>
                  </div>

                  <div className="infoItemText1">7/15</div>
                  <div className="infoItemText2">Staked/Total</div>

                  <OwlButton
                    type="dark"
                    text="Stake All"
                    className="mt24"
                    style={{ width: "100%" }}
                  />
                  <OwlButton
                    type="dark"
                    text="Claim All"
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                </div>

                <div className="infoItem2" style={{ textAlign: "center" }}>
                  <div className="flexBetween">
                    <div className="text5">Magic Fruit</div>
                    <div className="infoItemTextUp">
                      <img src={arrup} width="10" alt="" /> APR: 0%
                    </div>
                  </div>

                  <div className="infoItemText1">0/214</div>
                  <div className="infoItemText2">Staked/Total</div>

                  <OwlButton
                    type="dark"
                    text="Stake All"
                    className="mt24"
                    style={{ width: "100%" }}
                  />
                  <OwlButton
                    type="dark"
                    text="Claim All"
                    style={{ width: "100%", marginTop: "8px" }}
                  />
                </div>
              </div>

              <div className="infoItem2" style={{ margin: "16px 0" }}>
                <div className="text5" style={{ marginBottom: "30px" }}>
                  Referral Rewards
                </div>

                <div className="flexBetween" style={{ width: "100%" }}>
                  <div className="text3">Claimed</div>
                  <div className="text5">5,000,00</div>
                </div>
                <div
                  className="flexBetween"
                  style={{ width: "100%", margin: "16px 0" }}
                >
                  <div className="text3">Available</div>
                  <div className="text5">1,500,000</div>
                </div>
                <div className="flexBetween" style={{ width: "100%" }}>
                  <div className="text3">Locked</div>
                  <div className="text5">7,500,000</div>
                </div>

                <OwlButton
                  type="dark"
                  text="Claim 1,500,000 Owl"
                  className='mt36'
                  style={{ width: "100%", color: "#9EFF00" }}
                />

                <div className="flexBetween" style={{ margin: "32px 0 8px" }}>
                  <div className="text3">Invitation link</div>

                  <div className="text6">Invite list (12)</div>
                </div>

                <div className="flexBetween linkInfo">
                  <div className="text5">https://owl.games/s?bzdjsml</div>
                  <img src={copy} width="12" alt="" />
                </div>
              </div>
            </div>


            <div className="tableWrapper">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Treasury Revenue" key="1">
                <div className="tableItem flexBetween tableHeader">
                  <div className="tableHeaderItem" style={{width:'136px'}}>NFT</div>
                  <div className="tableHeaderItem" style={{width:'132px'}}>Earning</div>
                  <div className="tableHeaderItem" style={{width:'37px'}}>APR</div>
                  <div className="tableHeaderItem" style={{width:'56px'}}>Status</div>
                  <div className="tableHeaderItem" style={{width:'78px'}}>Operate</div>
                </div>
                  {tableData.map((item, index) => {
                    let { img, b, c, d, e } = item;
                    return (
                      <div className="tableItem flexBetween" key={index} onClick={()=>navigate("/my-item")}>
                        
                        <div className="flexCenter"><img src={img} width="32" alt="" style={{marginRight:'12px'}} />{b}</div>
                        <div>{c}</div>
                        <div>{d}</div>
                        <div>{e}</div>
                        <div>
                          {index > 5 ? (
                            <OwlButton text="Claim" size="small" />
                          ) : (
                            <OwlButton text="Claim" type="light" size="small" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TabPane>
                <TabPane tab="My Owldinal" key="2">
                <div className="tableItem flexBetween tableHeader">
                  <div className="tableHeaderItem" style={{width:'136px'}}>NFT</div>
                  <div className="tableHeaderItem" style={{width:'132px'}}>Earning</div>
                  <div className="tableHeaderItem" style={{width:'37px'}}>APR</div>
                  <div className="tableHeaderItem" style={{width:'56px'}}>Status</div>
                  <div className="tableHeaderItem" style={{width:'78px'}}>Operate</div>
                </div>
                  {tableData.map((item, index) => {
                    let { img, b, c, d, e } = item;
                    return (
                      <div className="tableItem flexBetween" key={index} onClick={()=>navigate("/my-item")}>
                        <div className="flexCenter"><img src={img} width="32" alt="" style={{marginRight:'12px'}} />{b}</div>

                        <div>{c}</div>
                        <div>{d}</div>
                        <div>{e}</div>
                        <div>
                          {index > 5 ? (
                            <OwlButton text="Claim" size="small" />
                          ) : (
                            <OwlButton text="Claim" type="light" size="small" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
