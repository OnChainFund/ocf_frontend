import type { AppProps } from "next/app";

import { wrapper } from "app/store/store";
import type { NextPageWithLayout } from "../types/page";
import { ApolloProvider } from "@apollo/client";
import client from "apollo-client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createClient, configureChains, Chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";

const fuji = {
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
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png"],
  testnet: true,
};
const { chains, provider, webSocketProvider } = configureChains(
  [fuji],
  [publicProvider()]
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

type Props = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        coolMode
        chains={chains}
        theme={darkTheme({
          accentColor: "#623485", //color of wallet  try #703844
          accentColorForeground: "white", //color of text
          borderRadius: "large", //rounded edges
          fontStack: "system",
        })}
      >
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default wrapper.withRedux(MyApp);
