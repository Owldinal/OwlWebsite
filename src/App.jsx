import { useState, useEffect } from "react";
import "./App.css";
import cn from "classnames";
import OwlButton from "./components/Button/index.jsx";
import HomeHeader from "./components/HomeHeader";

import b1 from "./assets/b1.png";
import b2 from "./assets/b2.png";
import dot from "./assets/dot.png";
import n1 from "./assets/01.png";
import n2 from "./assets/02.png";
import n3 from "./assets/03.png";
import n4 from "./assets/04.png";
import icon from "./assets/icon.png";

import { useNavigate } from "react-router-dom";

import { Button, Modal } from "antd";

function App() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(1);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleOk = () => {
    setDialogVisible(false);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const showModal = () => {
    setDialogVisible(true);
  };

  const debounce = (fn, wait) => {
    let timeout = null;
    return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) fn.apply(context, args);
    };
  };

  const handleScroll = (e) => {
    console.log("e: ", e);
    console.log("tab: ", tab);
    let fn = debounce(()=>{
      if (tab === 1) {
        setTab(2)
      }else if(tab ===2){
        setTab(3)
      }else{
        setTab(1)
      }
    },1000)
    fn()
    // if (tab === 1) {
    //   debounce(()=>setTab(2),1000);
    // } else if (tab === 2) {
    //   debounce(()=>setTab(3),1000);
    // } else {
    //   debounce(()=>setTab(1),1000);
    // }
  };

  useEffect(() => {
    // window.addEventListener('mousewheel', handleScroll, { passive: true }) 
    // return () => (window.removeEventListener('mousewheel', handleScroll) );
    let scrollTimeout
    document.addEventListener('wheel', ()=> {
      scrollTimeout && clearTimeout(scrollTimeout);
      console.log('clearTimeout: ', clearTimeout);

      scrollTimeout = setTimeout(()=> {
        console.log('滚轮停止滚动');
        if (tab === 1) {
          setTab(2)
        }else if(tab ===2){
          setTab(3)
        }else{
          setTab(1)
        }
      }, 50); // 100毫秒内没有滚动事件发生则认为停止滚动
    });
  }, [tab]);

  return (
    <div className="rootInnerWrapper">
      <HomeHeader />
      <div className="home">
        <div className="tabs flexColumnCenter">
          <div
            onClick={() => setTab(1)}
            className={cn("tab flexCenter", tab === 1 && "activeTab")}
          >
            Narrative
          </div>
          <div
            onClick={() => setTab(2)}
            className={cn("tab flexCenter", tab === 2 && "activeTab")}
          >
            Mint
          </div>
          <div
            onClick={() => setTab(3)}
            className={cn("tab flexCenter", tab === 3 && "activeTab")}
          >
            Roadmap
          </div>
        </div>
        <div className="content flexCenter">
          {tab === 1 && (
            <div className="tabItem flexCenter flexC">
              <img
                width="45%"
                src={b1}
                alt=""
                className="margin0"
                style={{ marginRight: "24px" }}
              />
              <div className="tabText">
                Owldinal launches Merlin’s premiere NFT game featuring magical
                Gen0 ERC721 Owls and legendary items for battles and quests.{" "}
                <br />
                <br />
                Players engage in strategy-rich gaming, diving deeper into the
                game’s lore and mysteries with each play. <br />
                <br />
                Emphasizing community exploration, this eternal adventure is
                fueled by Merlin's magic and collective creativity.
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="tabItem flexCenter flexC">
              <img
                width="45%"
                src={b2}
                alt=""
                style={{ marginRight: "24px" }}
                className="width60"
              />
              <div className="tabInfo flexColumnBetween width90">
                <div style={{ width: "100%" }}>
                  <div className="tabInfoItem flexBetween">
                    <div className="infoKey">Total Supply:</div>
                    <div className="infoValue">5,000</div>
                  </div>
                  <div className="tabInfoItem flexBetween">
                    <div className="infoKey">Price:</div>
                    <div className="infoValue">0</div>
                  </div>
                  <div className="tabInfoItem flexBetween">
                    <div className="infoKey">Max Mint Per Address:</div>
                    <div className="infoValue">5,000</div>
                  </div>
                  <div className="infoLine"></div>
                  <div className="infoText1">You are eligible</div>
                </div>
                <div style={{ width: "100%" }}>
                  <div className="flexBetween">
                    <div className="infoKey">0/5000</div>
                    <div className="infoKey">0%</div>
                  </div>
                  <div className="progress"></div>

                  <OwlButton text="Mint" size="big" />
                </div>
              </div>
            </div>
          )}

          {tab === 3 && (
            <div className="tabItem flexBetween">
              <div className="tabCard">
                <div className="dots flexBetween">
                  <img src={dot} width="6" alt="" />
                  <img src={dot} width="6" alt="" />
                </div>
                <div  className="nwrap">
                  <img
                    src={n1}
                    width="100%"
                    style={{ marginTop: "24px" }}
                    alt=""
                  />
                </div>

                <div className="cardTitle">Gen0 Box Mint</div>
                <div className="cardText">
                  Initiate with Gen0 Box minting, introducing magical ERC721
                  Owls as the foundation of the game's ecosystem.
                </div>
              </div>
              <div className="tabCard">
                <div className="dots flexBetween">
                  <img src={dot} width="6" alt="" />
                  <img src={dot} width="6" alt="" />
                </div>
                <div  className="nwrap">
                  <img
                    src={n2}
                    width="100%"
                    style={{ marginTop: "24px" }}
                    alt=""
                  />
                </div>

                <div className="cardTitle">Staking Gameplay</div>
                <div className="cardText">
                  Activate staking, allowing players to engage their Owls and
                  assets for rewards, enhancing game involvement.
                </div>
              </div>
              <div className="tabCard">
                <div className="dots flexBetween">
                  <img src={dot} width="6" alt="" />
                  <img src={dot} width="6" alt="" />
                </div>
                <div className="nwrap">
                  <img
                    src={n3}
                    width="100%"
                    style={{ marginTop: "24px" }}
                    alt=""
                  />
                </div>

                <div className="cardTitle">Breeding Gameplay</div>
                <div className="cardText">
                  Introduce breeding, enabling the creation of new Owl
                  generations, adding gameplay depth and diversity.
                </div>
              </div>
              <div className="tabCard">
                <div className="dots flexBetween">
                  <img src={dot} width="6" alt="" />
                  <img src={dot} width="6" alt="" />
                </div>
                <div className="nwrap">
                  <img
                    src={n4}
                    width="100%"
                    style={{ marginTop: "24px" }}
                    alt=""
                  />
                </div>

                <div className="cardTitle">Cave Gameplay</div>
                <div className="cardText">
                  Expand into Cave exploration, offering challenges and treasure
                  hunts to explore Merlin's realm further.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tabs flexColumnCenter">
          <div
            className="tab flexCenter"
            onClick={() => setDialogVisible(true)}
            style={{ textAlign: "center" }}
          >
            Connect wallet
          </div>
          <div className="tab flexCenter">Mint</div>
          <div className="tab flexCenter">Play</div>
        </div>

        <Modal
          title={null}
          open={dialogVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <h4 className="dialogTitle">Choose wallet</h4>

          <div className="dItem">
            <img width="24" src={icon} alt="" className="dIcon" /> OKX
          </div>
          <div className="dItem">UniSat</div>
        </Modal>
      </div>
    </div>
  );
}

export default App;
