import Head from "next/head";
import type { NextPage } from "next";
import { selectAccountState, setAccountState } from "../../store/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "store/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, ChakraProvider, Flex } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import BasicTable from "components/BasicTable";
import VaultListCard from "components/vaults/VaultListCard";
import { vaultDatas, VaultColumnDatas } from "pages/api/mocks/vaults";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      console.log("State on server", store.getState());
      return {
        props: {
          authState: false,
        },
      };
    }
);
const Vault: NextPage = () => {
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
          <BasicTable
            link="vault"
            datas={vaultDatas}
            columns={VaultColumnDatas}
          />
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
