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
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { BigNumber, Contract, utils } from "ethers";
import React from "react";
import { useDebounce } from "use-debounce";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
declare let window: any;
interface Prop {
  buttonTitle: string;
  contractAddress: string;
  contractInterface: Array<object>;
  functionName: string;
  functionArgs: Array<any>;
  functionEnabled: boolean;
}
export function SendTransactionButton(props: Prop) {
  const { address, connector, isConnected } = useAccount();
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$/, ""));
  const [value, setValue] = React.useState(0);
  const debouncedValue = useDebounce(value, 500);
  // updates the value if no change has been made for 500 milliseconds
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: props.contractAddress,
    contractInterface: props.contractInterface,
    overrides: {
      gasLimit: 20e5,
    },
    functionName: props.functionName,
    args: props.functionArgs,
    enabled: props.functionEnabled,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const toast = useToast();
  const toastIdRef = React.useRef();

  if (!isConnected) {
    return (
      <Button onClick={onOpen} disabled={true}>
        Not Connected
      </Button>
    );
  }
  function sendTransaction() {
    write();
    onClose();
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
      <Button onClick={sendTransaction} colorScheme="blue" mr={3}>
        {props.buttonTitle}
      </Button>
    </>
  );
}
