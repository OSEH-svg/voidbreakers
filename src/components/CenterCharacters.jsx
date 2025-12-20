import React from "react";
import charactersImage from "../assets/images/characters.png";

const CenterCharacters = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "5%",
        left: "45%",
        transform: "translateX(-50%)",
        zIndex: 5,
        width: "auto",
        height: "auto",
        maxWidth: "90vw",
      }}
    >
      <img
        src={charactersImage}
        alt="Characters"
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "60vh",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

export default CenterCharacters;
