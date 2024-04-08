import "./index.css";
import logo from "@/assets/logo.png";
import OwlButton from "@/components/Button/index.jsx";
import { useNavigate } from "react-router-dom";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";

export default function (props) {

    const targetChain = props.targetChain;

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

                    <OwlButton text="2,731,345.87 Owl" type="dark"/>
                    <OwlButton text="Buy Owl" type="dark" style={{margin: "0 16px"}}/>

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
