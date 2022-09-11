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
import { getAUMByUSDT, getNavPerShareByUSDT } from "app/feature/vaults";

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
  sharePriceNow: number,
  sharePriceOrigin: number,
  date: string
) {
  // 獲取時間差
  const timeDelta = new Date().getTime() - new Date(date).getTime();

  // 獲取價格差
  // 計算 價格差/平均一個月的時間差
  const averageMonthlyReturn =
    (sharePriceNow - sharePriceOrigin) / (timeDelta / 2592000);
  return averageMonthlyReturn;
}
const Vault: NextPageWithLayout = () => {
  const router = useRouter();
  const { address } = router.query;
  const [vaultData, setvaultData] = useState({
    AUM: 0,
    navPerShare: 0,
    navAverageMonthReturn: 0,
    navAverageMonthGrowth: 0,
  });
  const callData = async () => {
    const aum = Number(await getAUMByUSDT(address as string));
    const navPerShare = Number(await getNavPerShareByUSDT(address as string));
    const navAverageMonthReturn = getAverageMonthlyReturn(
      navPerShare,
      data["fund"]["price"][0]["navPerShare"],
      data["fund"]["price"][0]["date"]
    );
    const navAverageMonthGrowth =
      (navAverageMonthReturn / data["fund"]["price"][0]["navPerShare"]) * 100;
    const vaultData = {
      AUM: aum,
      navPerShare: navPerShare,
      navAverageMonthReturn: navAverageMonthReturn,
      navAverageMonthGrowth: navAverageMonthGrowth,
    };
    setvaultData(vaultData);
  };
  const { data, loading, error } = useQuery(GET_VAULT_DETAIL, {
    variables: { address },
  });
  useEffect(() => {
    if (loading || !router.isReady) return;
    callData();
  }, [router, loading]);

  if (loading || !router.isReady) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  console.log(vaultData.AUM);
  const VaultNavList: Array<VaultNav> = [
    {
      name: "Overview",
      component: (
        <VaultOverview
          priceChartData={data["fund"]["price"]}
          name={data["fund"]["name"]}
          description={data["fund"]["description"]}
          aum={vaultData.AUM}
          averageMonthlyReturn={vaultData.navAverageMonthReturn}
          averageMonthlyGrowth={vaultData.navAverageMonthGrowth}
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
