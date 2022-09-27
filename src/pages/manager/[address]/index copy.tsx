import type { NextPageWithLayout } from "../../../types/page";
import { selectAccountState } from "../../../app/store/slices/accountSlice";
import BasicStatistics from "../../../components/fund/VaultInfo";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "app/store/store";
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
  chakra,
} from "@chakra-ui/react";
import { Layout } from "layouts/provider";
import { useRouter } from "next/router";
import { VaultChart } from "components/fund/VaultChart";
import { DepositButton } from "components/buttons/Deposit";
import { WithdrawButton } from "components/buttons/Withdraw";
import { Contract, ethers } from "ethers";
import VaultLib from "../../../abis/ocf/VaultLib.json";
import Head from "next/head";
import { FunctionNotFinished } from "components/FunctionNotFinished";
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
declare let window: any;

const FundOverview = () => {
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
            <Flex w="40%"></Flex>
          </Flex>
          <Flex></Flex>
        </Box>
        <Box w="100%" h="40%" mt={10}>
          {/*<BasicStatistics />*/}
        </Box>
      </Box>
    </>
  );
};

type VaultNav = { name: string; component: any };
const VaultNavList: Array<VaultNav> = [
  { name: "Overview", component: <FundOverview /> },
  { name: "Trade", component: <FunctionNotFinished /> },
  { name: "Landing", component: <FunctionNotFinished /> },
  { name: "Farming", component: <FunctionNotFinished /> },
  { name: "Setting", component: <FunctionNotFinished /> },
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

export default Vault;
