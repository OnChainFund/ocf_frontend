import React, { useEffect, useRef } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import TransferERC20 from "components/TransferERC20";
import { DataTable } from "components/DataTable";
import { columns, data } from "pages/api/mocks/data";
import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function App() {
  return (
    <ChakraProvider>
      <ConnectButton />
    </ChakraProvider>
  );
}
