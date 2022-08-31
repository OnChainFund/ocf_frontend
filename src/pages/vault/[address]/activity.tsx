import type { NextPage } from "next";
import BasicStatistics from "../../../components/vault/VaultType";
import { wrapper } from "store/store";
import Link from "next/link";
import { Box, ChakraProvider, Tab, TabList, Tabs } from "@chakra-ui/react";
import { Layout } from "layouts/layout";
import { useRouter } from "next/router";
export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {
      authState: false,
    },
  };
});
type VaultNav = { name: string; endpoint: string };
const VaultNavList: Array<VaultNav> = [
  { name: "Overview", endpoint: "" },
  { name: "Portflio", endpoint: "portfolio" },
  { name: "Financials", endpoint: "financial" },
  { name: "Fees", endpoint: "fee" },
  { name: "Activity", endpoint: "activity" },
];
const Vault: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  return (
    <>
      <Tabs>
        <TabList>
          {VaultNavList.map((nav) => (
            <Tab key={nav.name}>
              <Link href={"/vault/" + address + "/" + nav.endpoint}>
                {nav.name}
              </Link>
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Box w="100%" h="100%">
        <Box bg="tomato" w="100%" h="60%" color="white">
          VaultChartCard
        </Box>
        <Box bg="blue.200" w="100%" h="20%" color="white">
          <BasicStatistics />
        </Box>
      </Box>
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
