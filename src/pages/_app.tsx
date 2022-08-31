import type { AppProps } from "next/app";
import { wrapper } from "store/store";
import type { NextPageWithLayout } from "../types/page";

type Props = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}

export default wrapper.withRedux(MyApp);
