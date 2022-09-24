import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
  Text,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccountState } from "app/store/slices/accountSlice";
import { BigNumber, ethers, utils, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import VaultLib from "../../abis/ocf/VaultLib.json";
import { ERC20ABI } from "../../abis/ERC20ABI";

import { RepeatIcon } from "@chakra-ui/icons";
import { useAccount } from "wagmi";
declare let window: any;

interface Prop {
  asset: string;
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
}
export function WithdrawButton(props: Prop) {
  const { address, connector, isConnected } = useAccount();
  const AccountState = useSelector(selectAccountState);
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$/, ""));
  const [value, setValue] = React.useState(1);
  const [balance, setBalance] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  function deposit() {
    redeemSharesForSpecificAssets(props.asset, props.comptrollerProxyAddress);
    onClose();
  }
  function showBalance(amount: number): number {
    const present = amount / 1e18;
    return present;
  }
  async function tokenBalance(account: string, vaultProxyAddress: string) {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const vaultProxy = new ethers.Contract(
      vaultProxyAddress,
      VaultLib["abi"],
      provider
    );

    vaultProxy
      .balanceOf(account)
      .then((result: string) => {
        setBalance(Number(result));
      })
      .catch("error", console.error);
  }

  async function redeemSharesForSpecificAssets(
    asset: string,
    comptrollerProxyAddress: string
  ) {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const denominatedAsset = asset;
    const comptrollerProxy: Contract = new ethers.Contract(
      comptrollerProxyAddress,
      ComptrollerLib["abi"],
      signer
    );
    comptrollerProxy
      .redeemSharesForSpecificAssets(
        address,
        BigInt(value * 1e18),
        [denominatedAsset],
        [10000],
        {
          gasLimit: 20e5,
          //gasPrice: 20e14,
        }
      )
      .catch((e: Error) => console.log(e));
  }
  if (!isConnected) {
    return (
      <Button onClick={onOpen} disabled={true}>
        Not Connected
      </Button>
    );
  }
  return (
    <>
      <Button onClick={onOpen}>Withdraw</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Flex>
                <FormLabel>Amount</FormLabel>
                <Spacer />

                <Flex>
                  <Text
                    _hover={{ color: "teal.500" }}
                    onClick={() => setValue(showBalance(balance))}
                  >
                    Balance: {showBalance(balance).toFixed(2)}
                  </Text>
                  <Button
                    p={5}
                    bg="white"
                    onClick={() =>
                      tokenBalance(address, props.comptrollerProxyAddress)
                    }
                  >
                    <RepeatIcon aria-label="sorted ascending" />
                  </Button>
                </Flex>
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
            <Button onClick={deposit} colorScheme="blue" mr={3}>
              Withdraw
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
