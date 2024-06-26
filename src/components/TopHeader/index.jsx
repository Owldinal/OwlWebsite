import "./index.css";
import logo from "@/assets/logo.png";
import OwlButton from "@/components/Button/index.jsx";
import { useNavigate } from "react-router-dom";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useReadContracts, useSwitchChain } from "wagmi";
import { addCommaInNumber } from "@/util.js";

export default function (props) {

    const targetChain = props.targetChain;
    const balance = props.balance;

    const navigate = useNavigate()
    const {openConnectModal, connectModalOpen} = useConnectModal();
    const {openAccountModal, accountModalOpen} = useAccountModal();
    const {isConnected, address, chain} = useAccount();
    const {chains, switchChain} = useSwitchChain();

    return (
        <div>
            <div className="topHead flexBetween">
                <div className='flexCenter' onClick={() => {
                    navigate('/')
                }} style={{cursor: 'pointer'}}>

                    <img src={logo} height="40" alt="" style={{marginRight: "24px"}}/>
                    <div>
                        Owldinal
                    </div>

                </div>

                <div className="flexCenter">

                    <OwlButton text={addCommaInNumber(balance) + " Owl"} type="dark"/>
                    <a href="https://merlinswap.org/trade/swap?tokenFrom=0x62e99191071fc1c5947cf1e21aa95708dcc51adb&tokenTo=0xf6d226f9dc15d9bb51182815b320d3fbe324e1ba&chainId=4200"
                       target="_blank" style={{textDecoration: 'none'}}>
                        <OwlButton text="Buy Owl" type="dark" style={{margin: "0 16px"}}/>
                    </a>

                    {!isConnected &&
                        <OwlButton func={openConnectModal} text="Connect wallet"/>}

                    {(isConnected && chain !== targetChain) &&
                        <OwlButton func={() => switchChain({chainId: targetChain.id})}
                                   text={"Switch to Merlin"}/>}

                    {(isConnected && chain === targetChain) &&
                        <OwlButton func={openAccountModal}
                                   text={address.slice(0, 6) + "..." + address.slice(-4)}/>}

                </div>

            </div>
        </div>
    );
}
