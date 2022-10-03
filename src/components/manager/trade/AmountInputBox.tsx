import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  useDisclosure,
  Flex,
  Spacer,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import {} from "framer-motion";
import { Asset } from "types/asset";
import ChooseTokenModel from "./ChooseTokenModel";
interface Prop {
  assets: Asset[];
  asset: Asset;
  amount: string;
  type: 1 | 2;
  setAsset: Function;
  setAmount: Function;
}

export default function AmountInputBox(props: Prop) {
  function setAsset(asset: Asset) {
    props.setAsset(props.type, asset);
  }
  const parse = (val) => val.replace(/^\$/, "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isError =
    Number(props.amount) > Number(props.asset.balance) && props.type === 1;
  return (
    <Box pt={3}>
      <Flex>
        <Box>
          {" "}
          <Button onClick={onOpen}>
            {props.asset.title} {"  "}
            <Icon as={TriangleDownIcon} />
          </Button>
          <ChooseTokenModel
            asset={props.assets}
            isOpen={isOpen}
            onClose={onClose}
            chooseTokenButtonOnClick={setAsset}
          />
        </Box>
        <Spacer />
        <Button
          onClick={() => props.setAmount(props.type, props.asset.balance)}
        >
          Balance:{Number(props.asset.balance).toFixed(2)}
        </Button>
      </Flex>
      <FormControl isInvalid={isError}>
        <InputGroup mt={3}>
          <NumberInput
            placeholder="Enter amount"
            onChange={(valueString) =>
              props.setAmount(props.type, parse(valueString))
            }
            value={props.amount.toString()}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
        {!isError ? <></> : <FormErrorMessage>Over Balance</FormErrorMessage>}
      </FormControl>
    </Box>
  );
}
