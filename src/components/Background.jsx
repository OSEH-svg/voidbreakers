import React from "react";

const Background = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('./src/assets/images/Background Image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }}
    >
      <img
        src="./src/assets/images/Background Image.png"
        alt=""
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
