import type { NextPageWithLayout } from "../../../types/page";
import {
  ChakraProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Layout } from "layouts/LayoutProvider";
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

const GET_VAULT_DETAIL = gql`
  query MyQuery {
    fund(pk: "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678") {
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
        price
        date
      }
    }
  }
`;

const Vault: NextPageWithLayout = () => {
  const router = useRouter();
  const { address } = router.query;
  const { data, loading, error } = useQuery(GET_VAULT_DETAIL);
  if (loading) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  console.log(data);

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
          <TabPanel h="100%" key="Overview">
            <VaultOverview
              name={data["fund"]["name"]}
              description={data["fund"]["description"]}
            />
          </TabPanel>
          <TabPanel h="100%" key="Portflio">
            <PortFolio />
          </TabPanel>
          <TabPanel h="100%" key="Financials">
            <Financials />
          </TabPanel>
          <TabPanel h="100%" key="Fees">
            <Fee />
          </TabPanel>
          <TabPanel h="100%" key="Policies">
            <Policies />
          </TabPanel>
          <TabPanel h="100%" key="Depositers">
            <Depositer />
          </TabPanel>
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
