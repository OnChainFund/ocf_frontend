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
import { tokenDatas, tokenColumns } from "pages/api/mocks/portfolio";
import type { TokenInfo, TokenColumn } from "pages/api/mocks/portfolio";
import BasicTable from "../BasicTable";

interface Props {
  link: string;
}
export default function PortFolio() {
  const columns = tokenColumns;
  const data = tokenDatas;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Token Holdings
        </chakra.h1>
      </Box>
      <BasicTable link="/" datas={tokenDatas} columns={tokenColumns} />
    </>
  );
}
