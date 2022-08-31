import React, { useEffect, useRef } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import TransferERC20 from "components/TransferERC20";
import { DataTable } from "components/DataTable";
import { columns, data } from "pages/api/mocks/data";

export default function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <DataTable columns={columns} data={data} />
      </div>
    </ChakraProvider>
  );
}
