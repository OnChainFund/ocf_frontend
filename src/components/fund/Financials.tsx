import {
  Box,
  Button,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { nodeProvider } from "app/feature/basic";
import { Addresses } from "abis/ocf/Address";
import { default as FundValueCalculator } from "abis/ocf/FundValueCalculator.json";
import { default as ERC20 } from "abis/ERC20.json";
import { ethers } from "ethers";
const options = [
  { id: 1, desc: "1 lorem ipsum" },
  { id: 2, desc: "Lorem, ipsum dolor." },
  { id: 3, desc: "Monthly Updates" },
];
interface ValueItemProps {
  title: string;
  options: Array<{ id: number; desc: string }>;
  content: string;
  checked?: boolean;
}

type ValueProps = {
  gav: number;
  nav: number;
  supply: number;
  price: number;
  tokenName: string;
  denominatedAssetName: string;
};
const ValueItem = ({ title, content }: ValueItemProps) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack
        p={3}
        py={3}
        justifyContent={{
          base: "flex-start",
          md: "space-around",
        }}
        direction={{
          base: "column",
          md: "row",
        }}
        alignItems={{ md: "left" }}
      >
        <Box w={"100%"}>
          <Heading textAlign={"left"} size={"md"}>
            {title}
          </Heading>
        </Box>
        <Box w={"100%"}>
          <Heading size={"md"}>{content}</Heading>
        </Box>
      </Stack>
    </Box>
  );
};
const ValueCard = ({
  gav,
  nav,
  supply,
  price,
  tokenName,
  denominatedAssetName,
}: ValueProps) => {
  return (
    <>
      <Divider />
      <ValueItem
        title={"Gross Asset Value (GAV)"}
        content={toPresentNumber(gav) + "\t\t\t" + denominatedAssetName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Net Asset Value (NAV)"}
        content={toPresentNumber(nav) + "\t\t\t" + denominatedAssetName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Share Supply"}
        content={toPresentNumber(supply) + "\t\t\t" + tokenName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Share Price"}
        content={toPresentNumber(price) + "\t\t\t" + denominatedAssetName}
        options={options}
      />
    </>
  );
};
function toPresentNumber(value: number) {
  return (value / 1e18).toFixed(2);
}
interface Prop {
  name: string;
}
const Fianacials = (props: Prop) => {
  const router = useRouter();
  const { address } = router.query;
  const [fundFinancialData, setFundFinancialData] = useState({
    gav: 0,
    nav: 0,
    supply: 0,
    price: 0,
  });
  const callData = async () => {
    const fundValueCalculator = new ethers.Contract(
      Addresses["ocf"]["FundValueCalculator"],
      FundValueCalculator["abi"],
      nodeProvider
    );
    const vaultProxyERC20 = new ethers.Contract(
      address as string,
      ERC20["abi"],
      nodeProvider
    );
    const gavValue = await fundValueCalculator.callStatic.calcGavInAsset(
      address,
      Addresses.USDT
    );
    const navValue = await fundValueCalculator.callStatic.calcNavInAsset(
      address,
      Addresses.USDT
    );
    const navShareValue =
      await fundValueCalculator.callStatic.calcNetShareValueInAsset(
        address,
        Addresses.USDT
      );
    const supply = await vaultProxyERC20.totalSupply();
    //console.log(ethers.utils.formatEther(tx));
    setFundFinancialData({
      gav: gavValue,
      nav: navValue ,
      supply: supply,
      price: navShareValue ,
    });
  };
  useEffect(() => {
    if (!router.isReady) return;
    callData();
  }, [router]);
  return (
    <Box py={6} px={5} minW={"100vh"}>
      <Stack spacing={4} width={"100%"} direction={"column"}>
        <Heading size={"lg"}>Value</Heading>
        <ValueCard
          gav={fundFinancialData.gav}
          nav={fundFinancialData.nav}
          supply={fundFinancialData.supply}
          price={fundFinancialData.price}
          tokenName={props.name}
          denominatedAssetName={"USDT"}
        />
        <Heading size={"lg"}>Return Metrics</Heading>

        <Heading size={"lg"}>Risk Metrics (Trailing 30 Days)</Heading>
      </Stack>
    </Box>
  );
};

export default Fianacials;
