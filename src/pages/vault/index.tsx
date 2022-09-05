import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { selectAccountState } from "../../app/store/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { DataTable } from "components/DataTable";
import VaultListCard from "components/vaults/VaultListCard";
import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import { ethers } from "ethers";
import { nodeProvider } from "../../app/feature/basic";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import { getAUM } from "app/feature/comptrollerLib";
import { useEffect, useState } from "react";
// vault
type VaultType = {
  address: string;
  name: string;
  aum: number;
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
        }
      }
    `,
  });

  //let vaultData: VaultType[] = await Promise.all(
  //  data.allFunds["allFunds"].map((vault) => ({
  //    address: vault.comptrollerProxy,
  //    name: vault.name,
  //    //aum: getAUM(vault.comptrollerProxy),
  //    aum: 1,
  //    thisMonth: 25.4,
  //    thisWeek: 10,
  //    thisDay: -10,
  //  }))
  //);
  //console.log(data);
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
      cell: (info) => info.getValue(),
      header: "AUM",
    }),
    columnHelper.accessor("thisMonth", {
      cell: (info) => info.getValue(),
      header: "This Montth",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor("thisWeek", {
      cell: (info) => info.getValue(),
      header: "This Week",
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor("thisDay", {
      cell: (info) => info.getValue(),
      header: "This Day",
      meta: {
        isNumeric: true,
      },
    }),
  ];
  const callData = async () => {
    const data = await allFunds["allFunds"].map(async (vault) => ({
      address: vault.comptrollerProxy,
      name: vault.name,
      aum: getAUM(await vault.comptrollerProxy),
      //aum: 1,
      thisMonth: 25.4,
      thisWeek: 10,
      thisDay: -10,
    }));
    setvaultData(data);
  };

  useEffect(() => {
    callData();
  }, []);
  console.log(vaultData);
  console.log(allFunds["allFunds"]);
  const router = useRouter();
  const AccountState = useSelector(selectAccountState);
  const dispatch = useDispatch();
  return (
    <>
      <Head>
        <title>Vaults</title>
      </Head>
      <>
        <VaultListCard />
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
