import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { BigNumber, ethers, utils } from "ethers";
import { Addresses } from "abis/ocf/Address";
import { ERC20ABI } from "abis/ERC20ABI";
import { nodeProvider } from "app/feature/utils/basic";
export function GetMockedUSDT() {
  const { address, connector, isConnected } = useAccount();
  const erc20 = new ethers.Contract(Addresses.USDT, ERC20ABI, nodeProvider);
  function sendUSD() {
    console.log("asdf");
    const user: ethers.Wallet = new ethers.Wallet(
      "baa235a9bb3244ee5b34c251a7a1fe3a4a65ace8aa22e33a443152f81015f714",
      nodeProvider
    );
    const tx = erc20
      .connect(user)
      .transfer(address, BigNumber.from(BigInt(1e20)));
  }
  if (!isConnected) {
    return <Button disabled={true}>Not Connected</Button>;
  }
  return (
    <>
      <Button onClick={sendUSD}>Get Test USDT</Button>
    </>
  );
}
