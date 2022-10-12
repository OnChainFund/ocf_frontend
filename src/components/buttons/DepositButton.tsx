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
} from "@chakra-ui/react";
import { ethers, utils } from "ethers";
import { default as ERC20 } from "abis/ERC20.json";
import React from "react";
import { useDebounce } from "use-debounce";
import { useAccount, useContractReads } from "wagmi";
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
  const denominatedAssetContract = {
    addressOrName: props.denominatedAssetAddress,
    contractInterface: ERC20["abi"],
  };

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...denominatedAssetContract,
        functionName: "balanceOf",
        args: [address], // account
      },
      {
        ...denominatedAssetContract,
        functionName: "symbol",
        args: [],
      },
      {
        ...denominatedAssetContract,
        functionName: "allowance",
        args: [address, props.comptrollerProxyAddress], // owner,spender
      },
    ],
    allowFailure: false,
    cacheTime: 100_000,
  });

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  if (!isConnected) {
    return <Button disabled={true}>Not Connected</Button>;
  }
  if (isLoading) return <>Fetching data…</>;
  if (isError) return <>Error fetching data</>;
  const balance = Number(ethers.utils.formatEther(data[0]));
  const allowance = Number(ethers.utils.formatEther(data[2]));
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
                <Button m={3} onClick={() => setValue(balance)}>
                  Balance: {balance.toFixed(2)} {data[1]}
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
            {value > allowance ? (
              <SendTransactionButton
                afterClick={() => {}}
                buttonTitle={"Approve"}
                contractAddress={props.denominatedAssetAddress}
                contractInterface={ERC20["abi"]}
                functionName={"approve"}
                functionArgs={[
                  props.comptrollerProxyAddress, //spender
                  utils.parseEther("100000000"), // amount
                ]}
                functionEnabled={true}
                notClickable={false}
              ></SendTransactionButton>
            ) : (
              <SendTransactionButton
                afterClick={() => {}}
                buttonTitle={
                  value <= balance ? "Deposit" : "Amount Over Balance"
                }
                contractAddress={props.comptrollerProxyAddress}
                contractInterface={[
                  {
                    inputs: [
                      {
                        internalType: "address",
                        name: "_buyer",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "_investmentAmount",
                        type: "uint256",
                      },
                      {
                        internalType: "uint256",
                        name: "_minSharesQuantity",
                        type: "uint256",
                      },
                    ],
                    name: "buySharesOnBehalf",
                    outputs: [
                      {
                        internalType: "uint256",
                        name: "sharesReceived_",
                        type: "uint256",
                      },
                    ],
                    stateMutability: "nonpayable",
                    type: "function",
                  },
                ]}
                functionName={"buySharesOnBehalf"}
                functionArgs={[
                  address, // _buyer
                  utils.parseEther(value.toString()), // _investmentAmount
                  10000, // _minSharesQuantity
                ]}
                functionEnabled={Boolean(debouncedValue)}
                notClickable={!(value <= balance)}
              ></SendTransactionButton>
            )}

            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
