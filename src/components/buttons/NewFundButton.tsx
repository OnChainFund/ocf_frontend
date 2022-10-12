import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  useToast,
  UseToastOptions,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Addresses } from "abis/ocf/Address";
import { Tokens } from "constants/tokens";

export function NewFundButton() {
  const { address, isConnected } = useAccount();
  const [value, setValue] = React.useState({
    name: "My New Fund",
    symbol: "MNF",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    addressOrName: Addresses.ocf.FundDeployer,
    contractInterface: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_fundOwner",
            type: "address",
          },
          {
            internalType: "string",
            name: "_fundName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_fundSymbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "_denominationAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_sharesActionTimelock",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_feeManagerConfigData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "_policyManagerConfigData",
            type: "bytes",
          },
        ],
        name: "createNewFund",
        outputs: [
          {
            internalType: "address",
            name: "comptrollerProxy_",
            type: "address",
          },
          {
            internalType: "address",
            name: "vaultProxy_",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    overrides: {
      gasLimit: 20e5,
    },
    functionName: "createNewFund",
    args: [
      address,
      value.name,
      value.symbol,
      Tokens.USDT,
      0, //_sharesActionTimelock
      "0x", // _feeManagerConfigData
      "0x",
    ],
    enabled: true,
  });
  const { data, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const toast = useToast();
  const toastIdRef = React.useRef();
  function submit() {
    write();
    onClose();
  }
  if (!isConnected) {
    return <Button disabled={true}>Not Connected</Button>;
  }

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }
  function addToast(status: UseToastOptions["status"], description: string) {
    toastIdRef.current = toast({
      status: status,
      description: description,
      position: "bottom-right",
    });
  }
  if (isPrepareError || isError) {
    close();
    addToast("error", "Something Wrong, Your Transaction Errored");
  }
  if (isLoading) {
    close();
    addToast("loading", "Sending Your Transaction...");
  }
  if (isSuccess) {
    close();
    addToast("success", "Your Transaction is success");
  }
  return (
    <>
      <Button onClick={onOpen}>Create New Fund</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Fund</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text m="8px">Fund Name: </Text>
            <Input
              value={value.name}
              onChange={(event) =>
                setValue({ ...value, name: event.target.value })
              }
              size="sm"
            />
            <Text m="8px">Fund Symbol: </Text>
            <Input
              value={value.symbol}
              onChange={(event) =>
                setValue({ ...value, symbol: event.target.value })
              }
              size="sm"
            />
            <Text m="8px">Fund Denominated Asset: </Text>
            <Input
              value={"USDT"}
              onChange={(event) =>
                setValue({ ...value, symbol: event.target.value })
              }
              disabled={true}
              size="sm"
            />

            <Flex>
              <Spacer />
              <Button mt={4} colorScheme="teal" onClick={submit} type="submit">
                Submit
              </Button>
              <Button mt={4} ml={3} onClick={onClose}>
                Cancel
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
