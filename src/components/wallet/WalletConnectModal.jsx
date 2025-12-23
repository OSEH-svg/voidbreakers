import { useConnect } from "@starknet-react/core";
import { useState } from "react";
import readyLogo from "../../assets/icons/ready.svg";
import braavosLogo from "../../assets/icons/braavos.svg";
import starknetLogo from "../../assets/icons/starknetLogo.svg";

const WalletConnectModal = ({ isOpen, onClose, onConnect }) => {
  const { connect, connectors } = useConnect();
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState("");

  const handleWalletClick = async (walletId) => {
    setError("");
    setIsConnecting(walletId);

    try {
      const connector = connectors.find((c) => c.id === walletId);

      if (!connector) {
        setError(
          `${walletId} wallet not detected. Please install and unlock it, then refresh.`
        );
        setIsConnecting("");
        return;
      }

      if (!connector.available()) {
        setError(
          `${connector.name} is not available. Please unlock your wallet and refresh.`
        );
        setIsConnecting("");
        return;
      }

      await connect({ connector });
      if (onConnect) onConnect();
      onClose();
    } catch (err) {
      console.error("Connection error:", err);
      const error = err;
      setError(error?.message || "Connection failed. Please try again.");
    } finally {
      setIsConnecting("");
    }
  };

  if (!isOpen) return null;

  const wallets = [
    {
      id: "argentX",
      name: "Ready Wallet",
      logo: readyLogo,
      bgColor: "bg-[#FF875B]",
    },
    {
      id: "braavos",
      name: "Braavos",
      logo: braavosLogo,
      bgColor: "bg-[#1657d5]",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="relative backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="absolute inset-0 gradient-border-1 rounded-3xl opacity-50" />
          <div className="absolute inset-0 gradient-border-2 rounded-3xl opacity-50" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Connect Wallet
              </h2>
              <button
                onClick={onClose}
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

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Wallet Options */}
            <div className="space-y-3">
              {wallets.map((wallet) => {
                const connector = connectors.find((c) => c.id === wallet.id);
                const isAvailable = connector?.available() ?? false;
                const isLoading = isConnecting === wallet.id;

                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletClick(wallet.id)}
                    disabled={isLoading}
                    className="group relative w-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`${wallet.bgColor} rounded-xl p-3 flex-shrink-0`}
                      >
                        <img
                          src={wallet.logo}
                          alt={wallet.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-semibold">
                            {wallet.name}
                          </p>
                          {isAvailable && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              <span className="text-green-400 text-[10px] font-medium">
                                Detected
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="text-white/50 text-xs mt-0.5">
                          {isLoading ? "Connecting..." : "Click to connect"}
                        </p>
                      </div>

                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs text-center flex items-center justify-center space-x-2">
                <span>Powered by</span>
                <span className="font-semibold text-white/70">Starknet</span>
                <img src={starknetLogo} alt="starknet" width={24} height={24} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
