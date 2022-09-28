import {
  Button,
  Flex,
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
  Spacer,
  useDisclosure,
  useToast,
  UseToastOptions,
  Text,
} from "@chakra-ui/react";
import { BigNumber, utils } from "ethers";
import React from "react";
import { useDebounce } from "use-debounce";
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { SendTransactionButton } from "./SendTransactionButton";
interface Prop {
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
  denominatedAssetAddress: string;
}
export function DepositButton(props: Prop) {
  const { address, isConnected } = useAccount();
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$\./, ""));
  const [value, setValue] = React.useState(0);
  const debouncedValue = useDebounce(value, 500);
  // updates the value if no change has been made for 500 milliseconds
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: props.denominatedAssetAddress,
    cacheTime: 2_000,
  });
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  if (!isConnected) {
    return <Button disabled={true}>Not Connected</Button>;
  }
  if (isLoading) return <>Fetching balance…</>;
  if (isError) return <>Error fetching balance</>;

  return (
    <>
      <Button onClick={onOpen}>Deposit</Button>

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
              <Flex>
                <FormLabel>Amount</FormLabel>
                <Spacer />
                <Button m={3} onClick={() => setValue(Number(data?.formatted))}>
                  Balance: {Number(data?.formatted).toFixed(2)} {data?.symbol}
                </Button>
              </Flex>

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
            <SendTransactionButton
              buttonTitle={
                value <= Number(data?.formatted)
                  ? "Deposit"
                  : "Amount Over Balance"
              }
              contractAddress={props.comptrollerProxyAddress}
              contractInterface={[
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "_recipient",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "_sharesQuantity",
                      type: "uint256",
                    },
                    {
                      internalType: "address[]",
                      name: "_payoutAssets",
                      type: "address[]",
                    },
                    {
                      internalType: "uint256[]",
                      name: "_payoutAssetPercentages",
                      type: "uint256[]",
                    },
                  ],
                  name: "redeemSharesForSpecificAssets",
                  outputs: [
                    {
                      internalType: "uint256[]",
                      name: "payoutAmounts_",
                      type: "uint256[]",
                    },
                  ],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ]}
              functionName={"redeemSharesForSpecificAssets"}
              functionArgs={[
                address,
                utils.parseEther(value.toString()),
                [props.denominatedAssetAddress],
                [10000],
              ]}
              functionEnabled={Boolean(debouncedValue)}
              notClickable={!(value <= Number(data?.formatted))}
            ></SendTransactionButton>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
