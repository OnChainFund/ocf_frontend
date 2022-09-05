import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { selectAccountState, setAccountState } from "../../app/store/slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "app/store/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, ChakraProvider, Flex } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { DataTable } from "components/DataTable";
import VaultListCard from "components/manager/VaultListCard";
import { VaultColumns, vaultData } from "pages/api/mocks/vaults";

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {
      authState: false,
    },
  };
});
const Vault: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Manager</title>
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
