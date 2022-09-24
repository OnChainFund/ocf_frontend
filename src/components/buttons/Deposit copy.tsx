import {
  Button,
  FormControl,
  FormLabel,
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
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ethers, Contract } from "ethers";
import DepositWrapper from "../../abis/ocf/DepositWrapper.json";
import { useAccount } from "wagmi";
declare let window: any;

export function DepositButton() {
  const { address, connector, isConnected } = useAccount();
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$/, ""));
  const [value, setValue] = React.useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  function deposit() {
    exchangeEthAndBuyShares();
    onClose();
  }

  async function exchangeEthAndBuyShares() {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const depositWrapper: Contract = new ethers.Contract(
      DepositWrapper["address"],
      DepositWrapper["abi"],
      signer
    );
    depositWrapper
      .exchangeEthAndBuyShares(
        "0x8a479C366EE7E51eF0Bc2c496b9707CEF0aC610c", //comptrollerProxy
        "0x6cEeB8fec16F7276F57ACF70C14ecA6008d3DDD4", //wavax
        BigInt(1e18),
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        0,
        {
          value: BigInt(value * 1e18),
          gasLimit: 20e5,
        }
      )
      .catch((e: Error) => console.log(e));
  }

  return (
    <>
      {!isConnected ? (
        <Button onClick={onOpen} disabled={true}>
          Not Connected
        </Button>
      ) : (
        <Button onClick={onOpen}>Deposit</Button>
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                onChange={(valueString) => setValue(parse(valueString))}
                value={format(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={deposit} colorScheme="blue" mr={3}>
              Deposit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
