import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { selectAccountState } from "../../app/store/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, ChakraProvider, Text } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { DataTable } from "components/DataTable";
import VaultListCard from "components/vaults/VaultListCard";
import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { getAUM, getAUMByUSDT } from "app/feature/vaults";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
// vault
type VaultType = {
  address: string;
  name: string;
  aum: number;
  denominatedAsset: {
    name: string;
    address: string;
  };
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

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query {
        allFunds {
          name
          creator
          denominatedAsset {
            name
            address
          }
          vaultProxy
          comptrollerProxy
          price {
            date
            price
          }
          depositors
        }
      }
    `,
  });

  return {
    props: {
      allFunds: data.allFunds,
    },
  };
}

const Vault: NextPageWithLayout = (allFunds) => {
  const [vaultData, setvaultData] = useState({
    depositorCount: 0,
    AUMSum: 0,
    table: [],
  });
  
  const VaultColumns = [
    columnHelper.accessor("address", {
      cell: (info) => {
        return (
          <ExternalLinkIcon
            w={"3"}
            onClick={() => router.push("/vault/" + info.getValue())}
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
    for (let index = 0; index < allFunds["allFunds"].length; index++) {
      const vault = allFunds["allFunds"][index];
      const aumNow = Number(await getAUMByUSDT(vault.vaultProxy));
      pageData.AUMSum += aumNow;
      pageData.depositorCount += allFunds["allFunds"][index]["depositors"];
      let aumChange: number | "-"[] = ["-", "-", "-"]; // 1d ,7d, 30d
      const now = new Date();
      for (let index = 0; index < vault["price"].length; index++) {
        const date = new Date(vault["price"][index]["date"]);
        if (aumChange[0] === "-") {
          if (now.getTime() - date.getTime() > 86400) {
            aumChange[0] = vault["price"][index]["price"];
          }
        } else if (aumChange[1] === "-") {
          if (now.getTime() - date.getTime() > 7 * 86400) {
            aumChange[1] = vault["price"][index]["price"];
          }
        } else if (aumChange[2] === "-") {
          if (now.getTime() - date.getTime() > 30 * 86400) {
            aumChange[2] = vault["price"][index]["price"];
          }
        } else {
          break;
        }
      }
      // if (vault["price"][]!== null){

      // }

      tableResult.push({
        address: vault.vaultProxy,
        name: vault.name,
        aum: aumNow,
        //aum: 1,
        denominatedAsset: {
          name: vault.denominatedAsset["name"],
          address: vault.denominatedAsset["address"],
        },
        thisMonth: percentage(aumChange[0], aumNow),
        thisWeek: percentage(aumChange[1], aumNow),
        thisDay: percentage(aumChange[2], aumNow),
      });
    }
    pageData.table = await Promise.all(tableResult);
    setvaultData(pageData);
  };

  useEffect(() => {
    callData();
  }, []);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Vaults</title>
      </Head>
      <>
        <VaultListCard
          vaultCount={allFunds["allFunds"].length}
          depositorCount={vaultData.depositorCount}
          AUMSum={vaultData.AUMSum}
        />
        <Box mt={50}>
          <DataTable data={vaultData.table} columns={VaultColumns} />
        </Box>
      </>
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
