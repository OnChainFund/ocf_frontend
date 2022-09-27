import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { SimpleChart } from "components/chart/SimpleChart";
import { parse } from "graphql";
import { format } from "path";
import { useState } from "react";
import { Props } from "react-apexcharts";
import ChooseTokenModel from "./ChooseTokenModel";
import TradeConfirmButton from "./TradeConfirmButton";

interface Prop {
  comptrollerProxyAddress: string;
}

export default function TradePannel(props: Props) {
  interface Asset {
    title: string;
    address: string;
  }
  const Assets: Asset[] = [
    { title: "USDT", address: "0xd1Cc87496aF84105699E82D46B6c5Ab6775Afae4" },
    { title: "WAVAX", address: "0x6cEeB8fec16F7276F57ACF70C14ecA6008d3DDD4" },
    { title: "WBTC ", address: "0xbC9052c594261Acc1a26271567bDb72A8A1Acac9" },
    { title: "WETH ", address: "0x96058B65CE7d0DBa4B85DAf49E06663B97442137" },
    { title: "LINK ", address: "0x5B3a2CAED90515e36830167529AFeDea75419b7a" },
    { title: "AAVE", address: "0x9Bb8F40d53DA2796F34d85f5bf27C475Df03E70C" },
    { title: "AAPL", address: "0x930b24b4b578409153501429cc256FBbDAB6e893" },
    { title: "GOOGL", address: "0x6499b7b57D07a9091eB7cE5548c086308a868Fe9" },
    { title: "GLD", address: "0x7D157E24f3D6FB7Bd8B3008A76DFBCde267daCa8" },
    { title: "TSLA", address: "0x22044e0e4E2D774f34227FC8a1BF804Ff9Fc9A35" },
    { title: "EUR", address: "0x3339f437Fd3abCdaD135446B6F05bB957Bb29c6A" },
    { title: "JPY", address: "0xa0D0693047cC189D5742160941c1703857616889" },
    { title: "TWTR", address: "0x181Bf62B82AFafa87630C819482ABbA819e49601" },
    { title: "BTCDOWN", address: "0xE85e1219691aF541F064E111161174C1F7Db2e84" },
    { title: "ETHDOWN", address: "0xB7B8E01a9F5dFe405c37b667E8F81a66D4f629EA" },
    {
      title: "USDTDOWN",
      address: "0x7f5BE805EFdbc5b42A3cfBC41B2961A0A9d9e3B2",
    },
    {
      title: "AAVEDOWN",
      address: "0x0690b3F6f8271b000f800F051f82B65F41D29C5E",
    },
    {
      title: "AAPLDOWN",
      address: "0xC7c69FFC3561fb3284F4d6D25d8b69D8CB3b59e9",
    },
    {
      title: "TWTRDOWN",
      address: "0xe05F46AAfa9919f722bc83fbD2Bb7B3Ac23E1Bc2",
    },
    { title: "GLDDOWN", address: "0xFb1438372dB41dAFFcf4019e80eAE2D673B8c3b7" },
    {
      title: "TSLADOWN",
      address: "0xa19baf63747637D0233702bA8F1eFcD6729db4DF",
    },
    {
      title: "LINKDOWN",
      address: "0xA964EeaE6e77B1d01432942bc31186cB56eA5804",
    },
    {
      title: "AVAXDOWN",
      address: "0x33506d382684db988D9021A80dBEeEF46a5ABC3A",
    },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fromAsset, setFromAsset] = useState(Assets[0]);
  const [toAsset, setToAsset] = useState(Assets[2]);
  const [inputAmount, setInputAmount] = useState("1.0");
  const [outputAmount, setOutputAmount] = useState("1.0");
  const {
    isOpen: isFromAssetOpen,
    onOpen: onFromAssetOpen,
    onClose: onFromAssetClose,
  } = useDisclosure();
  const {
    isOpen: isToAssetOpen,
    onOpen: onToAssetOpen,
    onClose: onToAssetClose,
  } = useDisclosure();
  //const [tradeData, setTradeData] = useState({
  //  fromAsset: Assets[0],
  //  toAsset: Assets[1],
  //  inputAmount: "0.0",
  //  outputAmount: "0.0",
  //});

  const handleInputChange = (valueString) => {
    setInputAmount(parse(valueString));
  };
  const handleOutputChange = (valueString) => {
    setOutputAmount(parse(valueString));
  };
  const sendTransaction = (valueString) => {
    setOutputAmount(parse(valueString));
  };
  const format = (val) => val;
  const parse = (val) => val.replace(/^\$/, "");
  const switchInputOutput = () => {};

  return (
    <>
      <Box>
        <SimpleGrid columns={1} spacing={10}>
          <Box p={3}>
            <Text fontSize="2xl"> Trade </Text>
          </Box>
          <Box>
            <Box pt={3}>
              <Button onClick={onFromAssetOpen}>
                {fromAsset.title} {"  "}
                <Icon as={TriangleDownIcon} />
              </Button>
              <ChooseTokenModel
                asset={Assets}
                isOpen={isFromAssetOpen}
                onClose={onFromAssetClose}
                chooseTokenButtonOnClick={setFromAsset}
              />

              <InputGroup mt={3}>
                <NumberInput
                  placeholder="Enter amount"
                  onChange={handleInputChange}
                  value={format(inputAmount)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </Box>
            {/*<Center>
            <Button
              alignContent={"center"}
              p={3}
              mt={3}
              w={"10%"}
              bgColor={"white"}
            >
              <Icon as={ArrowUpIcon} />
              <Icon as={ArrowDownIcon} />
            </Button>
  </Center>*/}

            <Box pt={3}>
              <Button onClick={onToAssetOpen}>
                {toAsset.title} {"  "}
                <Icon as={TriangleDownIcon} />
              </Button>
              <ChooseTokenModel
                asset={Assets}
                isOpen={isToAssetOpen}
                onClose={onToAssetClose}
                chooseTokenButtonOnClick={setToAsset}
              />

              <InputGroup mt={3}>
                <NumberInput
                  placeholder="Enter amount"
                  onChange={handleOutputChange}
                  value={format(outputAmount)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </Box>
          </Box>
          <Spacer />
          <Box mt={3}>
            <Button w={"100%"}>Confirm</Button>
          </Box>
          <TradeConfirmButton
            fromAsset={fromAsset.address}
            toAsset={toAsset.address}
            comptrollerProxyAddress={props.comptrollerProxyAddress}
            minIncomingAssetAmount={inputAmount}
            outgoingAssetAmount={outputAmount}
            functionEnabled={true}
          />
        </SimpleGrid>
      </Box>
    </>
  );
}
