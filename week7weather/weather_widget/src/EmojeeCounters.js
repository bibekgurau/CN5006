import React, { useState, useEffect } from "react";
import Sunny from "./Sunny.png";
import Rainy from "./Rainy.png";
import Cloudy from "./Cloudy.png";

function EmojeeCounter(props) {
  console.log("pic is", props.pic);

  const [pic, setPic] = useState(Sunny);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect called", props.pic);

    if (props.pic === "Sunny") {
      setPic(Sunny);
    } else if (props.pic === "Rainy") {
      setPic(Rainy);
    } else if (props.pic === "Cloudy") {
      setPic(Cloudy);
    }
  }, [props.pic]);

  const ClickHandle = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div className="App">
      <p>
        {props.pic}{" "}
        <button onClick={ClickHandle}>
          {count}
          <img src={pic} alt="" style={{ width: "50px", marginLeft: "10px" }} />
        </button>
      </p>
    </div>
  );
}

export default EmojeeCounter;
