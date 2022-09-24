import type { AppProps } from "next/app";

import { wrapper } from "app/store/store";
import type { NextPageWithLayout } from "../types/page";
import { ApolloProvider } from "@apollo/client";
import client from "apollo-client";
import Providers from "../Providers";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createClient, configureChains, Chain } from "wagmi";

import { publicProvider } from "wagmi/providers/public";
import { useStore } from "react-redux";
import { Layout } from "layouts/provider";

type Props = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <Providers>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </Providers>
    </>
  );
}

export default wrapper.withRedux(MyApp);
