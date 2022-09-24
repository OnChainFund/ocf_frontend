import { Chain, chain, WagmiConfigProps } from "wagmi";
import { Provider, WebSocketProvider } from "@wagmi/core";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import client from "apollo-client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  lightTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createClient, configureChains } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { ReactNode } from "react";

const fuji: Chain = {
  id: 43113,
  name: "Fuji Testnet",
  network: "Avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: "https://api.avax-test.network/ext/bc/C/rpc",
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "Snowtrace", url: "https://testnet.snowtrace.io/" },
  },
  //iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png"],
  testnet: true,
};
const { chains, provider, webSocketProvider } = configureChains(
  [fuji],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://api.avax-test.network/ext/bc/C/rpc`,
        webSocket: `wss://api.avax-test.network/ext/bc/C/ws`,
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "On Chain Fund",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
type Props = {
  children: ReactNode;
};
export function WagmiProvider(props: Props) {
  return (
    <div>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          //coolMode
          chains={chains}
          theme={lightTheme({
            //accentColor: "#623485", //color of wallet  try #703844
            //accentColorForeground: "white", //color of text
            //borderRadius: "large", //rounded edges
            //fontStack: "system",
          })}
        >
          {props.children}
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
