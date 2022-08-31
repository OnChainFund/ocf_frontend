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
import { stringify } from "querystring";
import { FaCheckCircle } from "react-icons/fa";

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
        content={gav.toString() + denominatedAssetName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Net Asset Value (NAV)"}
        content={nav.toString() + denominatedAssetName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Share Supply"}
        content={supply.toString() + tokenName}
        options={options}
      />
      <Divider />
      <ValueItem
        title={"Share Price"}
        content={price.toString() + denominatedAssetName}
        options={options}
      />
    </>
  );
};
const Fianacials = () => {
  return (
    <Box py={6} px={5} min={"100vh"}>
      <Stack spacing={4} width={"100%"} direction={"column"}>
        <Heading size={"lg"}>Value</Heading>
        <ValueCard
          gav={5000}
          nav={6000}
          supply={50000}
          price={3000}
          tokenName={"V1"}
          denominatedAssetName={"DAI"}
        />
        <Heading size={"lg"}>Return Metrics</Heading>

        <Heading size={"lg"}>Risk Metrics (Trailing 30 Days)</Heading>
      </Stack>
    </Box>
  );
};

export default Fianacials;
