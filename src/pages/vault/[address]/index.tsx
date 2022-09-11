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
import { getAUMByUSDT } from "app/feature/vaults";

type VaultNav = { name: string; component: any };

const GET_VAULT_DETAIL = gql`
  query MyQuery($address: ID!) {
    fund(pk: $address) {
      name
      creator
      comptrollerProxy
      denominatedAsset {
        address
        name
      }
      depositors
      description
      vaultProxy
      price {
        gav
        navPerShare
        date
      }
    }
  }
`;
function getAverageMonthlyReturn(
  sharePrice: number,
  sharePriceOrigin: number,
  times: number
) {}
const Vault: NextPageWithLayout = () => {
  const router = useRouter();
  const { address } = router.query;
  const [vaultData, setvaultData] = useState({
    AUM: 0,
  });
  const callData = async () => {
    const aumNow = Number(await getAUMByUSDT(address as string));
    setvaultData({ AUM: aumNow });
  };
  useEffect(() => {
    if (!router.isReady) return;
    callData();
  }, []);
  const { data, loading, error } = useQuery(GET_VAULT_DETAIL, {
    variables: { address },
  });
  if (loading) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  console.log(data["fund"]["depositors"]);
  const VaultNavList: Array<VaultNav> = [
    {
      name: "Overview",
      component: (
        <VaultOverview
          name={data["fund"]["name"]}
          description={data["fund"]["description"]}
          aum={vaultData.AUM}
          averageMonthlyReturn={0}
          denominatedAssetName={data["fund"]["denominatedAsset"]["name"]}
          depositers={data["fund"]["depositors"]}
        />
      ),
    },
    { name: "Portflio", component: <PortFolio /> },
    { name: "Financials", component: <Financials /> },
    { name: "Fees", component: <Fee /> },
    { name: "Policies", component: <Policies /> },
    { name: "Depositers", component: <Depositer /> },
  ];
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
