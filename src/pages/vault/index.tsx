import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { selectAccountState, setAccountState } from "../../store/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "store/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, ChakraProvider, Flex } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { DataTable } from "components/DataTable";
import VaultListCard from "components/vaults/VaultListCard";
import { vaultData, VaultColumns } from "pages/api/mocks/vaults";
import { columns, data } from "pages/api/mocks/data";
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      return {
        props: {
          authState: false,
        },
      };
    }
);
const Vault: NextPageWithLayout = () => {
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
