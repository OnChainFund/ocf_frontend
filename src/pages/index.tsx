import type { NextPageWithLayout } from "../types/page";
import {
  selectAccountState,
  setAccountState,
} from "../app/store/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "app/store/store";
import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import Head from "next/head";
import HomeView from "components/HomeView";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      return {
        props: {
          authState: false,
        },
      };
    }
);
const Home: NextPageWithLayout = () => {
  const AccountState = useSelector(selectAccountState);
  const dispatch = useDispatch();
  return (
    <>
      <Head>
        <title>On Chain Fund</title>
      </Head>
      <HomeView />
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <ChakraProvider>{page}</ChakraProvider>;
};

export default Home;
