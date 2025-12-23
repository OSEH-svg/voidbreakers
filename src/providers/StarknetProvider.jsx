import { ReactNode } from "react";
import {
  StarknetConfig,
  publicProvider,
  useInjectedConnectors,
  argent,
  braavos,
} from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";

export default function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
    order: "alphabetical",
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
