import logo from "../assets/b1.png";
import star from "../assets/star40.png";

export default function () {
  return (
    <div>
      <div className="homeHead flexCenter">
        <img
          src={{logo}}
          height="60"
          alt=""
          style={{ marginRight: "24px" }}
        />{" "}
        Owldinal
        <div className="star1">
          <img src={star} width="40" alt="" />
        </div>
        <div className="star2">
          <img src={star} width="32" alt="" />
        </div>
        <div className="star3">
          <img src={star} width="32" alt="" />
        </div>
        <div className="star4">
          <img src={star} width="48" alt="" />
        </div>
      </div>
    </div>
  );
}
