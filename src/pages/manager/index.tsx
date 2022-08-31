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
import VaultListCard from "components/manager/VaultListCard";
import { VaultColumnDatas, vaultDatas } from "pages/api/mocks/vaults";

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {
      authState: false,
    },
  };
});
const Vault: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manager</title>
      </Head>
      <>
        <VaultListCard />
        <Box mt={50}>
          <BasicTable
            link="manager"
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
