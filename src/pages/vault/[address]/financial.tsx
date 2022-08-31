import type { NextPage } from "next";
import {
  selectAccountState,
  setAccountState,
} from "../../../store/accountSlice";
import BasicStatistics from "../../../components/vault/VaultType";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "store/store";
import Link from "next/link";
import { Box, ChakraProvider, Tab, TabList, Tabs } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import router from "next/router";
import { useRouter } from "next/router";
import VaultDetail from "layouts/VaultDetail";
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      // we can set the initial state from here
      // we are setting to false but you can run your custom logic here
      console.log("=================");
      console.log(params);
      console.log(store.getState());
      //const AccountState = useSelector(selectAccountState);
      // console.log(AccountState);
      //await store.dispatch(setAccountState(true));
      console.log("State on server", store.getState());
      return {
        props: {
          authState: false,
        },
      };
    }
);
type VaultNav = { name: string; endpoint: string };
const VaultNavList: Array<VaultNav> = [
  { name: "Overview", endpoint: "" },
  { name: "Portflio", endpoint: "portfolio" },
  { name: "Financials", endpoint: "financial" },
  { name: "Fees", endpoint: "fee" },
  { name: "Activity", endpoint: "activity" },
];
const Vault: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const AccountState = useSelector(selectAccountState);
  const dispatch = useDispatch();
  return (
    <>
      <Tabs>
        <TabList>
          {VaultNavList.map((nav) => (
            <Tab key={nav.name}>
              <Link href={"/vault/" + address + "/" + nav.endpoint}>
                {nav.name}
              </Link>
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Box w="100%" h="100%">
        <Box bg="tomato" w="100%" h="60%" color="white">
          VaultChartCard
        </Box>
        <Box bg="blue.200" w="100%" h="20%" color="white">
          <BasicStatistics />
        </Box>
      </Box>
    </>
  );
};

Vault.getLayout = function getLayout(page) {
  return (
    <ChakraProvider>
      <Layout>{page}</Layout>
    </ChakraProvider>
  );
};

export default Vault;
