import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { utils } from "ethers";
export function GetMockedUSDT() {
  const { address, connector, isConnected } = useAccount();

  if (!isConnected) {
    return <Button disabled={true}>Get Test USDT</Button>;
  }
  return (
    <>
      <Button>Get Test USDT</Button>
    </>
  );
}
