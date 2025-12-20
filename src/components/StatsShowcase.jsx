import React from "react";
import scrollIcon from "../assets/icons/scroll.svg";
import coinIcon from "../assets/icons/coin.svg";
import wolfGemIcon from "../assets/icons/wolfGem.svg";
import bearGemIcon from "../assets/icons/bearGem.svg";
import bullGemIcon from "../assets/icons/bullGem.svg";
import currentLevelIcon from "../assets/icons/currentLevel.svg";

const StatsShowcase = () => {
  return (
    <div className="fixed top-12 right-4 z-20 font-jungle">
      {/* Main container */}
      <div className="relative">
        <div className="absolute -top-5 -left-18 z-30">
          <img src={scrollIcon} alt="Scroll" className="w-20 h-18" />
          <div className="absolute top-10 right-4 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">3</span>
          </div>
        </div>

        <div className="absolute -top-10 left-7 z-30 gap-4 flex items-center">
          <img src={coinIcon} alt="coin" className="w-10 h-10" />
          <span className="text-white text-sm font-bold -ml-5 mt-2">3696</span>
        </div>

        <div className="absolute -top-6 right-30 z-30 gap-4">
          <span className="text-white text-[18px] -ml-5 mt-2 tracking-wide font-normal">
            Danii001
          </span>
        </div>

        {/* Main container */}
        <div
          className="bg-black relative"
          style={{
            clipPath: "polygon(6% 0%, 100% 0%, 95% 100%, 0% 100%)",
            width: "400px",
            height: "40px",
          }}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center -space-x-11">
            <div className="flex items-center">
              <img src={wolfGemIcon} alt="wolf gem" className="w-25 h-25" />
              <span className="text-[#A2FDFD] text-[17px] font-normal -ml-6 mt-2">
                2
              </span>
            </div>

            <div className="flex items-center">
              <img src={bearGemIcon} alt="bear gem" className="w-34 h-34" />
              <span className="text-[#FE7EFC] text-[17px] font-normal -ml-9 mt-2">
                4
              </span>
            </div>

            <div className="flex items-center">
              <img src={bullGemIcon} alt="bull gem" className="w-27 h-27" />
              <span className="text-[#FEE61F] text-[17px] font-normal -ml-7 mt-2">
                7
              </span>
            </div>
          </div>

          {/* Progress Bar*/}
          <div className="absolute right-26 top-2/4 -translate-y-1/2 flex items-center gap-1">
            <span className="text-white text-sm">40%</span>
            <div className="w-15 h-1 bg-[#00D9F1] rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-40">
          <img
            src={currentLevelIcon}
            alt="Current Level"
            className="w-28 h-28"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsShowcase;
