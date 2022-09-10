import type { NextPageWithLayout } from "../../../types/page";
import {
  ChakraProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { useRouter } from "next/router";
import Head from "next/head";
import PortFolio from "components/vault/PortFolio";
import Financials from "components/vault/Financials";
import Fee from "components/vault/Fee";
import Policies from "components/vault/Policies";
import Depositer from "components/vault/Depositer";
import { VaultOverview } from "components/vault/VaultOverview";
import client from "apollo-client";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

type VaultNav = { name: string; component: any };
const VaultNavList: Array<VaultNav> = [
  { name: "Overview", component: <VaultOverview /> },
  { name: "Portflio", component: <PortFolio /> },
  { name: "Financials", component: <Financials /> },
  { name: "Fees", component: <Fee /> },
  { name: "Policies", component: <Policies /> },
  { name: "Depositers", component: <Depositer /> },
];
const getVaultDetail = (vaultProxyAddress: string) => {
  console.log(vaultProxyAddress);
  const query = gql`
    query ($vaultProxyAddress: String!) {
      fund(vaultProxy: { eq: $vaultProxyAddress }) {
        name
        creator
        denominatedAsset {
          name
          address
        }
        vaultProxy
        comptrollerProxy
      }
    }
  `;
  return query;
};

const Vault: NextPageWithLayout = () => {
  const router = useRouter();
  const { address } = router.query;
  const [vaultData, setvaultData] = useState({
    name: "",
    description: "",
  });
  const callData = async () => {
    const { data } = await client.query({
      query: getVaultDetail(address as string),
    });
    setvaultData({ name: "", description: "" });
  };

  useEffect(() => {
    callData();
  }, []);

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
