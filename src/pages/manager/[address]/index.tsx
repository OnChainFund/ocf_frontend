import type { NextPageWithLayout } from "../../../types/page";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { getAUMByUSDT, getNavPerShareByUSDT } from "app/feature/vaults";
import { FunctionNotFinished } from "components/FunctionNotFinished";
import dynamic from "next/dynamic";
import Setting from "components/manager/setting/Setting";
const FundOverview = dynamic(() => import("components/fund/FundOverview"), {
  ssr: false,
});
const TradePannel = dynamic(
  () => import("components/manager/trade/TradePannel"),
  {
    ssr: false,
  }
);
type VaultNav = { name: string; component: any };

const GET_VAULT_DETAIL = gql`
  query GET_VAULT_DETAIL($address: ID!) {
    fund(pk: $address) {
      name
      creator {
        pk
      }
      comptrollerProxy
      denominatedAsset {
        address
        name
      }
      depositorCount
      depositors {
        pk
      }
      description
      vaultProxy
      price {
        gav
        navPerShare
        time
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
  const [vaultData, setVaultData] = useState({
    AUM: 0,
    navPerShare: 0,
    navAverageMonthReturn: 0,
    navAverageMonthGrowth: 0,
  });
  const { data, loading, error } = useQuery(GET_VAULT_DETAIL, {
    variables: { address },
  });

  useEffect(() => {
    if (loading || error || !router.isReady) return;
    callData();
  }, [router, loading]);

  if (loading || !router.isReady) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  const callData = async () => {
    const aum = Number(await getAUMByUSDT(address as string));
    const navPerShare = Number(await getNavPerShareByUSDT(address as string));
    let navAverageMonthReturn = 0;
    let navAverageMonthGrowth = 0;
    if (data["fund"]["price"].length > 0) {
      navAverageMonthReturn = getAverageMonthlyReturn(
        navPerShare,
        data["fund"]["price"][0]["navPerShare"],
        data["fund"]["price"][0]["time"]
      );
      navAverageMonthGrowth =
        (navAverageMonthReturn / data["fund"]["price"][0]["navPerShare"]) * 100;
    }

    const vaultData = {
      AUM: aum,
      navPerShare: navPerShare,
      navAverageMonthReturn: navAverageMonthReturn,
      navAverageMonthGrowth: navAverageMonthGrowth,
    };
    setVaultData(vaultData);
  };

  const VaultNavList: Array<VaultNav> = [
    {
      name: "Overview",
      component: (
        <FundOverview
          priceChartData={data["fund"]["price"]}
          name={data["fund"]["name"]}
          description={data["fund"]["description"]}
          aum={vaultData.AUM}
          averageMonthlyReturn={vaultData.navAverageMonthReturn}
          averageMonthlyGrowth={vaultData.navAverageMonthGrowth}
          denominatedAssetName={data["fund"]["denominatedAsset"]["name"]}
          depositers={data["fund"]["depositorCount"]}
          comptrollerProxyAddress={data.fund.comptrollerProxy}
          vaultProxyAddress={data["fund"]["vaultProxy"]}
          denominatedAssetAddress={data["fund"]["denominatedAsset"]["address"]}
        />
      ),
    },
    {
      name: "Trade",
      component: (
        <TradePannel
          comptrollerProxyAddress={data.fund.comptrollerProxy}
          vaultProxyAddress={data.fund.vaultProxy}
        />
      ),
    },
    { name: "Landing", component: <FunctionNotFinished /> },
    { name: "Farming", component: <FunctionNotFinished /> },
    {
      name: "Setting",
      component: (
        <Setting
          name={data["fund"]["name"]}
          description={data["fund"]["description"]}
        />
      ),
    },
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

export default Vault;
