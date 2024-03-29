import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { useRouter } from "next/router";
import { Box, Center } from "@chakra-ui/react";
import { DataTable } from "components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ManagerFundListCard from "components/manager/ManagerFundListCard";
import { useAccount } from "wagmi";
// vault
type VaultType = {
  address: string;
  name: string;
  aum: number;
  denominatedAsset: {
    name: string;
    address: string;
  };
  price: number;
  thisMonth: number | "-";
  thisWeek: number | "-";
  thisDay: number | "-";
};

interface pageDataType {
  depositorCount: number;
  AUMSum: number;
  table: VaultType[];
}

const columnHelper = createColumnHelper<VaultType>();

const GET_VAULTS_QUERY = gql`
  query ($address: String!) {
    funds(filters: { creator: { iExact: $address } }) {
      creator
      denominatedAsset
      vaultProxy
      comptrollerProxy
      name
      price {
        time
        gav
        navPerShare
      }
      depositorCount
    }
  }
`;

const Vault: NextPageWithLayout = () => {
  const { address, isConnected } = useAccount();
  const [vaultsData, setvaultsData] = useState({
    depositorCount: 0,
    AUMSum: 0,
    table: [],
  });
  const { data, loading, error } = useQuery(GET_VAULTS_QUERY, {
    variables: { address },
  });
  const router = useRouter();
  useEffect(() => {
    if (loading || error) return;
    callData();
  }, [router, loading]);

  if (loading) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  const VaultColumns = [
    columnHelper.accessor("address", {
      cell: (info) => {
        return (
          <ExternalLinkIcon
            w={"3"}
            onClick={() => router.push("/manager/" + info.getValue())}
          />
        );
      },
      header: "",
    }),
    columnHelper.accessor("name", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Name",
    }),
    columnHelper.accessor("aum", {
      cell: (info) => Number(info.getValue()).toFixed(2),
      header: "AUM(USDT)",
    }),
    columnHelper.accessor("denominatedAsset", {
      cell: (info) => info.getValue().name,
      header: "准入資產",
    }),
    columnHelper.accessor("price", {
      cell: (info) => Number(info.getValue()).toFixed(2),
      header: "Share Price(USDT)",
    }),
    columnHelper.accessor("thisMonth", {
      cell: (info) => (
        <p
          style={{
            color:
              info.getValue() === "-"
                ? "black"
                : info.getValue() >= 0
                ? "green"
                : "red",
          }}
        >
          {info.getValue()} %
        </p>
      ),
      header: "This Month",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor("thisWeek", {
      cell: (info) => (
        <p
          style={{
            color:
              info.getValue() === "-"
                ? "black"
                : info.getValue() >= 0
                ? "green"
                : "red",
          }}
        >
          {info.getValue()} %
        </p>
      ),
      header: "This Week",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor("thisDay", {
      cell: (info) => (
        <p
          style={{
            color:
              info.getValue() === "-"
                ? "black"
                : info.getValue() >= 0
                ? "green"
                : "red",
          }}
        >
          {info.getValue()} %
        </p>
      ),
      header: "This Day",
      meta: {
        isNumeric: true,
      },
    }),
  ];
  function percentage(oldValue: number | "-", newValue: number) {
    if (oldValue === "-") {
      return "-";
    } else {
      if (newValue === 0) {
        return 0;
      } else {
        return (((newValue - oldValue) / oldValue) * 100).toFixed(2);
      }
    }
  }
  const callData = async () => {
    let pageData: pageDataType = {
      depositorCount: 0,
      AUMSum: 0,
      table: [],
    };
    let tableResult = [];
    console.log(data.funds);
    for (let index = 0; index < data.funds.length; index++) {
      const fund = data.funds[index];
      let aumNow = 0;
      let priceNow = 0;
      if (fund.price.length !== 0) {
        aumNow = Number(fund.price.at(-1).gav);
        priceNow = Number(fund.price.at(-1).navPerShare);
      }
      //const aumNow = 1;
      pageData.AUMSum += aumNow;
      pageData.depositorCount += fund.depositorCount;
      //const priceNow = Number(data.funds.price.gav.at(-1));

      let aumChange: number | "-"[] = ["-", "-", "-"]; // 1d ,7d, 30d
      const now = new Date();
      for (let index = 0; index < fund["price"].length; index++) {
        const date = new Date(fund["price"][index]["time"]);
        if (aumChange[0] === "-") {
          if (now.getTime() - date.getTime() > 86400) {
            aumChange[0] = fund["price"][index]["gav"];
          }
        } else if (aumChange[1] === "-") {
          if (now.getTime() - date.getTime() > 7 * 86400) {
            aumChange[1] = fund["price"][index]["gav"];
          }
        } else if (aumChange[2] === "-") {
          if (now.getTime() - date.getTime() > 30 * 86400) {
            aumChange[2] = fund["price"][index]["gav"];
          }
        } else {
          break;
        }
      }
      // if (fund["price"][]!== null){

      // }

      tableResult.push({
        address: fund.vaultProxy,
        name: fund.name,
        aum: aumNow,
        //aum: 1,
        denominatedAsset: {
          name: "USDT",
          address: "0xd1Cc87496aF84105699E82D46B6c5Ab6775Afae4",
        },
        price: priceNow,
        thisMonth: percentage(aumChange[0], aumNow),
        thisWeek: percentage(aumChange[1], aumNow),
        thisDay: percentage(aumChange[2], aumNow),
      });
    }
    pageData.table = await Promise.all(tableResult);

    setvaultsData(pageData);
  };

  return (
    <>
      <Head>
        <title>Manager</title>
      </Head>
      <>
        <ManagerFundListCard
          vaultCount={data.funds.length}
          depositorCount={vaultsData.depositorCount}
          AUMSum={vaultsData.AUMSum}
        />
        <Box mt={50}>
          {data.funds.length === 0 ? (
            "You Don't Have any fund"
          ) : (
            <DataTable data={vaultsData.table} columns={VaultColumns} />
          )}
        </Box>
      </>
    </>
  );
};

export default Vault;
