/* eslint-disable react/jsx-key */
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  chakra,
  Link,
  Box,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy, Column } from "react-table";
import { tokenData, tokenColumns } from "pages/api/mocks/fee";
import { DataTable } from "../DataTable";

interface Props {
  link: string;
}
export default function Fee() {
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Fees
        </chakra.h1>
      </Box>
      <DataTable data={tokenData} columns={tokenColumns} />
    </>
  );
}
