import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swordIcon from "../assets/icons/sword.svg";
import chestIcon from "../assets/icons/chest.svg";
import cogIcon from "../assets/icons/cog.svg";
import WalletConnectModal from "./wallet/WalletConnectModal";

const HexButton = ({ label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full h-[75px] mb-1 cursor-pointer bg-transparent border-none transition-all duration-300 hover:scale-105 hover:brightness-125"
      style={{
        filter: "drop-shadow(0 0 8px rgba(0, 227, 238, 0.5))",
        maxWidth: "clamp(100px, 25vw, 300px)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 162 46"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.8" filter="url(#filter0_f_250_338)">
          <path
            d="M20.6853 6.34965L6 22.7832L20.8284 39.2168H142.364L156 22.7832L139.217 6L20.6853 6.34965Z"
            fill="#00E3EE"
          />
        </g>
        <path
          d="M20.6853 6.34965L6 22.7832L20.8284 39.2168H142.364L156 22.7832L139.217 6L20.6853 6.34965Z"
          fill="url(#paint0_linear_250_338)"
        />
        <path
          d="M24.8812 10.1958L16.1399 21.7342L24.5315 34.3216L138.168 35.0209L147.608 22.0839L135.72 9.49646L24.8812 10.1958Z"
          fill="#035A9C"
        />
        <path
          d="M24.5315 9.84619L21.035 6.69934L6.69934 22.4336L15.0909 21.7343L24.5315 9.84619Z"
          fill="#02CFE4"
        />
        <path
          d="M135.021 8.7972L138.867 6L21.035 6.34965L24.8812 9.4965L135.021 8.7972Z"
          fill="#00BDE6"
        />
        <path
          d="M15.7902 22.4336L6.34961 22.7832L20.6853 38.8672L24.1818 34.3217L15.7902 22.4336Z"
          fill="#00BDE6"
        />
        <path
          d="M142.364 39.2167L138.517 35.0209L24.5314 34.6713L20.6853 39.2167H142.364Z"
          fill="#0385CC"
        />
        <path
          d="M156 22.7832L147.958 22.4336L138.867 35.021L142.364 39.2168L156 22.7832Z"
          fill="#0376C1"
        />
        <path
          d="M139.217 6.34961L135.72 9.14681L147.958 22.0839L155.301 22.4335L139.217 6.34961Z"
          fill="#01D9E6"
        />
        <path
          opacity="0.05"
          d="M15.4406 13.3426L23.1329 8.44751L24.5315 9.84611L15.7902 21.3846L7.04895 22.4335L15.4406 13.3426Z"
          fill="black"
        />
        <path
          opacity="0.2"
          d="M139.566 13.3426L135.72 9.14681L139.217 6.34961L147.259 14.3916L139.566 13.3426Z"
          fill="#0376C1"
        />
        <g opacity="0.05">
          <path
            d="M16.4895 34.3217L19.6364 28.3777L20.6853 29.7763L17.5385 35.3707L16.4895 34.3217Z"
            fill="black"
          />
          <path
            d="M18.9371 36.7693L22.0839 31.5245L23.1329 32.9231L19.986 38.1679L18.9371 36.7693Z"
            fill="black"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_250_338"
            x="0"
            y="0"
            width="162"
            height="45.2168"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="3"
              result="effect1_foregroundBlur_250_338"
            />
          </filter>
          <linearGradient
            id="paint0_linear_250_338"
            x1="6"
            y1="22.6084"
            x2="156"
            y2="22.6084"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#02DBE5" />
            <stop offset="1" stopColor="#42F5FD" />
          </linearGradient>
        </defs>
      </svg>

      {/* Button Content */}
      <div className="absolute inset-0 flex items-center px-6 pointer-events-none">
        <span
          className="text-[#ffffff] font-sportize font-bold uppercase tracking-wider pl-8"
          style={{ fontSize: "clamp(18px, 2vw, 28px)" }}
        >
          {label}
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-300 text-lg">
          {icon ? (
            <img
              src={icon}
              alt={label}
              style={{
                width: "clamp(40px, 5vw, 72px)",
                height: "clamp(40px, 5vw, 72px)",
              }}
            />
          ) : null}
        </span>
      </div>
    </button>
  );
};

const LeftMenu = () => {
  const navigate = useNavigate();
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const buttons = [
    { label: "PLAY", icon: swordIcon, action: () => setShowChoiceModal(true) },
    { label: "LEADERBOARD", icon: null },
    { label: "OFFLINE PLAY", icon: null },
    { label: "STORE", icon: chestIcon },
    { label: "SETTINGS", icon: cogIcon },
  ];

  return (
    <>
      <div
        className="absolute z-10 flex flex-col font-extrabold"
        style={{
          left: "clamp(10px, 2vw, 32px)",
          top: "30%",
        }}
      >
        {buttons.map((button, index) => (
          <HexButton
            key={index}
            label={button.label}
            icon={button.icon}
            onClick={button.action || (() => {})}
          />
        ))}
      </div>

      {showChoiceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowChoiceModal(false)}
          />
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
            <div className="relative backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="absolute inset-0 gradient-border-1 rounded-3xl opacity-50" />
              <div className="absolute inset-0 gradient-border-2 rounded-3xl opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Choose Play Mode
                  </h2>
                  <button
                    onClick={() => setShowChoiceModal(false)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setShowChoiceModal(false);
                      setShowWalletModal(true);
                    }}
                    className="w-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">
                        Connect Wallet
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        Connect your starknet wallet
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowChoiceModal(false);
                      navigate("/gameplay");
                    }}
                    className="w-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">
                        Play Test
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        Play without wallet connection
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={() => navigate("/gameplay")}
      />
    </>
  );
};

export default LeftMenu;
