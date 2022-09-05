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
import { selectAccountState } from "store/slices/accountSlice";
import { BigNumber, ethers, utils, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import ComptrollerLib from "../../abis/ocf/ComptrollerLib.json";
import VaultLib from "../../abis/ocf/VaultLib.json";
import { ERC20ABI } from "../../abis/ERC20ABI";

import { RepeatIcon } from "@chakra-ui/icons";
declare let window: any;
export function WithdrawButton() {
  //
  const AccountState = useSelector(selectAccountState);
  //
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$/, ""));
  const [value, setValue] = React.useState(1);
  const [balance, setBalance] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  function deposit() {
    redeemSharesForSpecificAssets();
    onClose();
  }
  function showBalance(amount: number): number {
    const present = amount / 1e18;
    return present;
  }
  async function tokenBalance(account: string) {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(account);
    console.log(VaultLib);
    const vaultProxy = new ethers.Contract(
      "0x02b7a6d41F929a2d09D6dd8aF5537c1d1fe2E678",
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

  async function redeemSharesForSpecificAssets() {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const denominatedAsset = "0x6cEeB8fec16F7276F57ACF70C14ecA6008d3DDD4";
    const comptrollerProxy: Contract = new ethers.Contract(
      "0x8a479C366EE7E51eF0Bc2c496b9707CEF0aC610c",
      ComptrollerLib["abi"],
      signer
    );
    comptrollerProxy
      .redeemSharesForSpecificAssets(
        AccountState,
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

  return (
    <>
      {AccountState === "0x0000000000000000000000000000000000000000" ? (
        <Button onClick={onOpen} disabled={true}>
          Not Connected
        </Button>
      ) : (
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
                        onClick={() => tokenBalance(AccountState)}
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
      )}
    </>
  );
}
