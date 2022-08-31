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
import { depositerDatas, depositerColumns } from "pages/api/mocks/depositer";
import BasicTable from "../BasicTable";

interface Props {
  link: string;
}
export default function Depositer() {
  const columns = depositerColumns;
  const data = depositerDatas;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Depositers
        </chakra.h1>
      </Box>
      <BasicTable link="/" datas={data} columns={columns} />
    </>
  );
}
