import React, { useState } from "react";
import ariaCard from "../assets/images/ariaCard.png";
import ariaTag from "../assets/images/ariaTag.svg";
import bearGem from "../assets/icons/bearGem.svg";
import cadenCard from "../assets/images/cadenCard.png";
import cadenTag from "../assets/images/cadenTag.svg";
import wolfGem from "../assets/icons/wolfGem.svg";
import dravenCard from "../assets/images/dravenCard.png";
import dravenTag from "../assets/images/dravenTag.svg";
import bullGem from "../assets/icons/bullGem.svg";
import arrowLeft from "../assets/icons/arrowLeft.svg";
import arrowRight from "../assets/icons/arrowRight.svg";
import coin from "../assets/icons/coin.svg";

const RightMenu = () => {
  const cards = [
    {
      id: 0,
      name: "aria",
      image: ariaCard,
      tag: ariaTag,
      gem: bearGem,
      lov: 5595,
      gemCount: 89,

      tagStyle: {
        bottom: "-50px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "170px",
        rotate: "0.2deg",
      },

      statsStyle: {
        bottom: "-50px",
        left: "50%",
        transform: "translateX(-50%)",
      },
    },

    {
      id: 1,
      name: "caden",
      image: cadenCard,
      tag: cadenTag,
      gem: wolfGem,
      lov: 1245,
      gemCount: 156,

      tagStyle: {
        bottom: "-58px",
        left: "45%",
        transform: "translateX(-33%) rotate(-1deg)",
        width: "170px",
      },

      statsStyle: {
        bottom: "-60px",
        left: "45%",
        transform: "translateX(-27%)",
      },
    },

    {
      id: 2,
      name: "draven",
      image: dravenCard,
      tag: dravenTag,
      gem: bullGem,
      lov: 145,
      gemCount: 203,

      tagStyle: {
        bottom: "-58px",
        left: "48%",
        transform: "translateX(-38%) rotate(-1deg)",
        width: "170px",
      },

      statsStyle: {
        bottom: "-60px",
        left: "48%",
        transform: "translateX(-29%)",
      },
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      setIsTransitioning(false);
    }, 200);
  };

  const currentCard = cards[currentCardIndex];
  const nextCard = cards[(currentCardIndex + 1) % cards.length];

  return (
    <div
      style={{
        position: "fixed",
        right: "clamp(10px, 2vw, 20px)",
        bottom: "clamp(20px, 8vh, 70px)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "clamp(6px, 1.5vw, 15px)",
      }}
    >
      {/* Left arrow */}
      <div className="relative flex items-center">
        <button
          onClick={goToPrevious}
          style={{
            width: "clamp(30px, 4vw, 48px)",
            height: "clamp(30px, 4vw, 48px)",
          }}
          className={`flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-20 cursor-pointer
            ${
              currentCardIndex === 0
                ? "-mr-6"
                : currentCardIndex === 1
                ? "-mr-2"
                : "-mr-4"
            }`}
        >
          <img
            src={arrowLeft}
            alt="Previous"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </button>

        {/* Main card container */}
        <div
          style={{
            position: "relative",
            width: "clamp(155px, 20vw, 250px)",
            height:
              currentCard.name === "aria"
                ? "clamp(220px, 29.5vw, 370px)"
                : "clamp(243px, 31.2vw, 390px)",
            overflow: "hidden",
            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transform: isTransitioning ? "scale(0.98)" : "scale(1)",
          }}
        >
          <img
            src={currentCard.image}
            alt={currentCard.name}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Character Tag */}
        <div
          style={{
            position: "absolute",
            bottom: currentCard.tagStyle.bottom,
            left: currentCard.tagStyle.left,
            transform: currentCard.tagStyle.transform,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.5s ease-out",
          }}
        >
          <img
            src={currentCard.tag}
            alt={`${currentCard.name}Tag`}
            style={{
              width: `clamp(101px, 13.6vw, ${currentCard.tagStyle.width})`,
              height: "auto",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>

        {/* Stats*/}
        <div
          style={{
            position: "absolute",
            bottom: currentCard.statsStyle.bottom,
            left: currentCard.statsStyle.left,
            transform: currentCard.statsStyle.transform,
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 0vw, 16px)",
            transition: "all 0.5s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#00E3EE",
              fontSize: "clamp(10px, 1.1vw, 14px)",
              fontWeight: "bold",
            }}
          >
            <img
              src={coin}
              alt="Coin"
              style={{
                width: "clamp(14px, 1.6vw, 20px)",
                height: "clamp(14px, 1.6vw, 20px)",
              }}
            />
            <span>{currentCard.lov}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#00E3EE",
              fontSize: "clamp(10px, 1.1vw, 14px)",
              fontWeight: "bold",
            }}
          >
            <img
              src={currentCard.gem}
              alt={`${currentCard.name}Gem`}
              style={{
                width: "clamp(28px, 3.2vw, 40px)",
                height: "clamp(28px, 3.2vw, 40px)",
              }}
            />
            <span className="-ml-3">{currentCard.gemCount}</span>
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={goToNext}
          style={{
            width: "clamp(32px, 4vw, 48px)",
            height: "clamp(32px, 4vw, 48px)",
          }}
          className={`flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-20 cursor-pointer
            ${
              currentCardIndex === 0
                ? "-ml-10"
                : currentCardIndex === 1
                ? "-ml-13"
                : "-ml-12"
            }`}
        >
          <img
            src={arrowRight}
            alt="Next"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </button>
      </div>

      {/* Next card hint */}
      <div
        style={{
          width: "clamp(77px, 9.2vw, 115px)",
          height: "clamp(116px, 14.8vw, 185px)",
          opacity: 0.7,
          transform: "scale(0.7)",
          transformOrigin: "bottom left",
          overflow: "hidden",
          marginBottom: "clamp(-60px, -8vw, -100px)",
          transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <img
          src={nextCard.image}
          alt={nextCard.name}
          style={{
            width: "100%",
            height: "100%",
            // objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default RightMenu;
