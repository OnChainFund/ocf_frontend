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
import { getAUM, getAUMEthCall } from "app/feature/vaults";
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
  thisMonth: number;
  thisWeek: number;
  thisDay: number;
};

const columnHelper = createColumnHelper<VaultType>();

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query {
        allFunds {
          name
          creator
          vaultProxy
          comptrollerProxy
          denominatedAsset {
            name
            address
          }
          price {
            date
            price
          }
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
  const [vaultData, setvaultData] = useState([]);
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
      header: "AUM",
    }),
    columnHelper.accessor("denominatedAsset", {
      cell: (info) => info.getValue().name,
      header: "准入資產",
    }),
    columnHelper.accessor("thisMonth", {
      cell: (info) => (
        <p style={{ color: info.getValue() >= 0 ? "green" : "red" }}>
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
        <p style={{ color: info.getValue() >= 0 ? "green" : "red" }}>
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
        <p style={{ color: info.getValue() >= 0 ? "green" : "red" }}>
          {info.getValue()} %
        </p>
      ),
      header: "This Day",
      meta: {
        isNumeric: true,
      },
    }),
  ];
  function percentage(oldValue: number, newValue: number) {
    if (newValue === 0) {
      return 0;
    } else {
      return (newValue - oldValue) / oldValue;
    }
  }
  const callDataEthCall = async () => {
    let result = [];
    for (let index = 0; index < allFunds["allFunds"].length; index++) {
      const vault = allFunds["allFunds"][index];
      const aums = await getAUMEthCall(vault.comptrollerProxy, [0, 30, 7, 1]);
      console.log(aums);
      const aumNow = Number(ethers.utils.formatEther(aums[0]));
      const aum30DayAgo = Number(ethers.utils.formatEther(aums[1]));
      const aum7DayAgo = Number(ethers.utils.formatEther(aums[2]));
      const aum1DayAgo = Number(ethers.utils.formatEther(aums[3]));

      result.push({
        address: vault.comptrollerProxy,
        name: vault.name,
        aum: aumNow,
        //aum: 1,
        denominatedAsset: {
          name: vault.denominatedAsset["name"],
          address: vault.denominatedAsset["address"],
        },
        thisMonth: percentage(aum30DayAgo, aumNow),
        thisWeek: percentage(aum7DayAgo, aumNow),
        thisDay: percentage(aum1DayAgo, aumNow),
      });
    }
    const final = await Promise.all(result);
    setvaultData(final);
  };
  const callData = async () => {
    let result = [];
    for (let index = 0; index < allFunds["allFunds"].length; index++) {
      const timestampNowWithMillisecond = new Date().getTime();
      const timestampNow = Math.floor(timestampNowWithMillisecond / 1000);
      const timeDeltaInADay = 3600 * 24;
      const vault = allFunds["allFunds"][index];
      const aumNow = Number(await getAUM(vault.comptrollerProxy));
      const aum30DayAgo = Number(
        await getAUM(vault.comptrollerProxy, 30 * timeDeltaInADay)
      );
      const aum7DayAgo = Number(
        await getAUM(vault.comptrollerProxy, 7 * timeDeltaInADay)
      );
      const aum1DayAgo = Number(
        await getAUM(vault.comptrollerProxy, 1 * timeDeltaInADay)
      );
      result.push({
        address: vault.comptrollerProxy,
        name: vault.name,
        aum: aumNow,
        //aum: 1,
        denominatedAsset: {
          name: vault.denominatedAsset["name"],
          address: vault.denominatedAsset["address"],
        },
        thisMonth: percentage(aum30DayAgo, aumNow),
        thisWeek: percentage(aum7DayAgo, aumNow),
        thisDay: percentage(aum1DayAgo, aumNow),
      });
    }
    const final = await Promise.all(result);
    setvaultData(final);
  };

  useEffect(() => {
    callData();
  }, []);
  const router = useRouter();
  const AccountState = useSelector(selectAccountState);
  const dispatch = useDispatch();
  return (
    <>
      <Head>
        <title>Vaults</title>
      </Head>
      <>
        <VaultListCard vaultCount={allFunds["allFunds"].length} />
        <Box mt={50}>
          <DataTable data={vaultData} columns={VaultColumns} />
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
