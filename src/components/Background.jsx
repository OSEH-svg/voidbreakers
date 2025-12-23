import React from "react";
import backgroundImage from "../assets/images/Background Image.png";

const Background = () => {
  return (
    <div
      className="bg-optimized"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }}
    >
      <img
        src={backgroundImage}
        alt=""
        loading="eager"
        fetchpriority="high"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />
    </div>
  );
};

export default Background;
