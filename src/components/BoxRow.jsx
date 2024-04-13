import OwlButton from "@components/Button/index.jsx";

export default function (props) {

    return (
        <>
            <div className="tableItem flexBetween">
                <div style={{width: '136px'}}>{props.token_id}</div>
                <div style={{width: '132px'}}>{props.earning}</div>
                <div style={{width: '37px'}}>{props.apr}</div>
                <div style={{width: '56px'}}>{props.is_staking === true ? 'Staked' : 'Available'}</div>
                <OwlButton text={props.is_staking === true ? 'Claim' : 'Stake'} size="small"
                           func={props.func}/>
            </div>
        </>
    )

}
