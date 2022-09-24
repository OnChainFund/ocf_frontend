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
import { BigNumber, utils } from "ethers";
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
  comptrollerProxyAddress: string;
}
export function DepositButton(props: Prop) {
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
    addressOrName: props.comptrollerProxyAddress,
    contractInterface: [
      {
        name: "buyShares",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
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
        outputs: [
          {
            internalType: "uint256",
            name: "sharesReceived_",
            type: "uint256",
          },
        ],
      },
    ],
    overrides: {
      gasLimit: 20e5,
    },
    functionName: "buyShares",
    args: [utils.parseEther(value.toString()), BigNumber.from(1)],
    enabled: Boolean(debouncedValue),
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
  //console.log(props.comptrollerProxyAddress);
  function deposit() {
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
    addToast("loading", "Sending Your deposit...");
  }
  if (isSuccess) {
    close();
    addToast("success", "Your deposit is success");
  }
  return (
    <>
      <Button onClick={onOpen} disabled={!write || isLoading}>
        Deposit
      </Button>

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
