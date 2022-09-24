import React, { useEffect, useRef } from "react";
import { ChakraProvider, Spacer, Text } from "@chakra-ui/react";
import TransferERC20 from "components/TransferERC20";
import { DataTable } from "components/DataTable";
import { columns, data } from "pages/api/mocks/data";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { TestComponent } from "./TestComponent";
export default function App() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const balance = useBalance({
    addressOrName: address,
  });

  return (
    <ChakraProvider>
      <TestComponent />
    </ChakraProvider>
  );
}
