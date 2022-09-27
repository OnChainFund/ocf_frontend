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
} from "@chakra-ui/react";
import {} from "framer-motion";
import { format } from "path";
import { Asset } from "types/asset";
import ChooseTokenModel from "./ChooseTokenModel";
interface Prop {
  assets: Asset[];
  asset: Asset;
  setAsset: Function;

  handleChange: Function;
  amount: string;
  setAmount: Function;
}

export default function AmountInputBox(props: Prop) {
  const parse = (val) => val.replace(/^\$/, "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box pt={3}>
      <Button onClick={onOpen}>
        {props.asset.title} {"  "}
        <Icon as={TriangleDownIcon} />
      </Button>
      <ChooseTokenModel
        asset={props.assets}
        isOpen={isOpen}
        onClose={onClose}
        chooseTokenButtonOnClick={props.setAsset}
      />

      <InputGroup mt={3}>
        <NumberInput
          placeholder="Enter amount"
          onChange={(valueString) => props.setAmount(parse(valueString))}
          value={props.amount.toString()}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </InputGroup>
    </Box>
  );
}
