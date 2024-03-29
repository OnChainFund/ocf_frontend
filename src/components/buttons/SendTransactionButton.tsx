import {
  Button,
  useDisclosure,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import React from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
interface Prop {
  buttonTitle: string;
  contractAddress: string;
  contractInterface: Array<object>;
  functionName: string;
  functionArgs: Array<any>;
  functionEnabled: boolean;
  notClickable: boolean;
  afterClick: Function;
}
export function SendTransactionButton(props: Prop) {
  const { isConnected } = useAccount();
  const { onClose } = useDisclosure();

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
    return <Button disabled={true}>Not Connected</Button>;
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
    }) as undefined;
  }
  if (isPrepareError || isError) {
    close();
    addToast(
      "error",
      "Something Wrong, Your Transaction Errored \t Error:" +
        (prepareError || error)?.message
    );
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
      <Button
        onClick={() => {
          sendTransaction();
          props.afterClick();
        }}
        disabled={props.notClickable}
        colorScheme="blue"
        mr={3}
      >
        {props.buttonTitle}
      </Button>
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </>
  );
}
