import type { NextPageWithLayout } from "../../../types/page";
import { selectAccountState } from "../../../store/accountSlice";
import BasicStatistics from "../../../components/vault/VaultInfo";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "store/store";
import {
  Image,
  Box,
  ChakraProvider,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { useRouter } from "next/router";
import { VaultChart } from "components/vault/VaultChart";
import { DepositButton } from "components/buttons/Deposit";
import { WithdrawButton } from "components/buttons/Withdraw";
import { Contract, ethers } from "ethers";
import VaultLib from "../../../abis/ocf/VaultLib.json";
import Head from "next/head";
import { FunctionNotFinished } from "components/FunctionNotFinished";
import PortFolio from "components/vault/PortFolio";
import Financials from "components/vault/Financials";
import Fee from "components/vault/Fee";
import Policies from "components/vault/Policies";
import Depositer from "components/vault/Depositer";
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
declare let window: any;

const VaultOverview = () => {
  return (
    <>
      <Box w="100%" h="100%">
        <Box w="100%" h="60%">
          <Flex>
            {" "}
            <Box w="80%">
              <Stack spacing={1} p={5}>
                <Box>
                  <Flex>
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                    />
                    <Box ml={5}>
                      <Text fontSize="2xl">Vault 1</Text>
                      <Text fontSize="1xl" color="gray">
                        The Stable Strategy
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Stack>
            </Box>
            <Flex w="40%">
              <Box p={5}>
                <DepositButton />
              </Box>
              <Box p={5}>
                <WithdrawButton />
              </Box>
            </Flex>
          </Flex>
          <Flex>
            <VaultChart />
          </Flex>
        </Box>
        <Box w="100%" h="40%" mt={10}>
          <BasicStatistics />
        </Box>
      </Box>
    </>
  );
};

type VaultNav = { name: string; component: any };
const VaultNavList: Array<VaultNav> = [
  { name: "Overview", component: <VaultOverview /> },
  { name: "Portflio", component: <PortFolio /> },
  { name: "Financials", component: <Financials /> },
  { name: "Fees", component: <Fee /> },
  { name: "Policies", component: <Policies /> },
  { name: "Depositers", component: <Depositer /> },
];

const Vault: NextPageWithLayout = () => {
  const router = useRouter();

  const { address } = router.query;
  return (
    <>
      <Head>
        <title>Vault</title>
      </Head>
      <Tabs h="100%" w="100%">
        <TabList>
          {VaultNavList.map((nav) => (
            <Tab key={nav.name}>{nav.name}</Tab>
          ))}
        </TabList>
        <TabPanels h="100%">
          {VaultNavList.map((nav) => (
            <TabPanel h="100%" key={nav.name}>
              {nav.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
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
