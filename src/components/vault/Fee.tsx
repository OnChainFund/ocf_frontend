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
import { DataTable } from "../DataTable";
import { createColumnHelper } from "@tanstack/react-table";

export type feeType = {
  feeType: string;
  rate: number;
};

export const tokenData: feeType[] = [
  {
    feeType: "Management Fee",
    rate: 0.0,
  },
  {
    feeType: "Performance Fee",
    rate: 0.0,
  },
  {
    feeType: "Exit Fee",
    rate: 0.0,
  },
  {
    feeType: "Protocol Fee",
    rate: 0.25,
  },
];

const columnHelper = createColumnHelper<feeType>();

export const tokenColumns = [
  columnHelper.accessor("feeType", {
    cell: (info) => info.getValue(),
    header: "Fee Type",
  }),
  columnHelper.accessor("rate", {
    cell: (info) => <p>{info.getValue()} %</p>,
    header: "Rate",
  }),
];
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
