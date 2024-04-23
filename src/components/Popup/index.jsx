import styled from "styled-components";
import "./index.css";

const Mask = styled.div`
    background: rgba(0,0,0,0.5);
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ModalBg = styled.div`
    background: #151515;

    padding: 24px;
    border-radius: 16px;
    position: relative;
    width:640px;
`

const UlBox = styled.ul`
    margin-top: 24px;
    li{
        display: flex;
        height: 48px;
        width: 320px;
        padding: 0px 16px;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #E0E2EC;
        border-radius: 16px;
        cursor: pointer;
        margin-bottom: 12px;
        &:last-child{
            margin-bottom: 0;
        }
        &.op{
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
    img{
        width: 24px;
        height: 24px;
        border-radius: 24px;
    }
    .rht{
        flex-grow: 1;
        text-align: center;
        font-weight: bold;
    }

`

const CloseBox = styled.div`
    position: absolute;
    right: 20px;
    top:20px;
    cursor: pointer;
`

export default function Popup({elf,magic,nothing,handleClose}){
    const allCount = elf + magic + nothing;
    return <Mask>
        <ModalBg>
            <CloseBox onClick={()=>handleClose()}>
                <img className="close-img" src="close.png" alt=""/>
            </CloseBox>
            <div className="popup-main">
                <div className="popup-title">
                    You have opened <span className="popup-title-child">{allCount}</span> blind {allCount>1 ? <span>boxes</span> : (<span>box</span>)}
                </div>
                <div className="popup-icon-main">
                    {elf ? (<div className="popup-icon-child">
                        <img className="popup-icon-img" src="ELF.png" alt=""/>
                        <div className="popup-icon-desc elf-color">
                            ELF x{elf}
                        </div>
                    </div>):false}
                    {magic ? (<div className="popup-icon-child">
                        <img className="popup-icon-img" src="Magic.png" alt=""/>
                        <div className="popup-icon-desc magic-color">
                            Magic Fruit x{magic}
                        </div>
                    </div>):false}
                    {nothing ? (<div className="popup-icon-child">
                        <img className="popup-icon-img" src="Nothing.png" alt=""/>
                        <div className="popup-icon-desc nothing-color">
                            Nothing x{nothing}
                        </div>
                    </div>):false}
                </div>
                <div className="popup-button-main">
                    <div onClick={()=>handleClose()} className="popup-button" style={{cursor: 'pointer'}}>
                        OK
                    </div>
                </div>

            </div>
            <UlBox>

            </UlBox>
        </ModalBg>
    </Mask>
}
