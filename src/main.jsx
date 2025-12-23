import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "../index.css";

import { StarknetConfig, publicProvider } from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";

const chains = [sepolia, mainnet];
const provider = publicProvider();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StarknetConfig
      chains={chains}
      provider={provider}
      autoConnect
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StarknetConfig>
  </React.StrictMode>
);
