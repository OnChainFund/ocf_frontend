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
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy, Column } from "react-table";
import { vaultDatas, VaultColumnDatas } from "pages/api/mocks/vaults";
import type { VaultType, VaultColumnType } from "pages/api/mocks/vaults";

interface Props {
  link: string;
  datas: any;
  columns: any;
}
export default function BasicTable(
  props: Props = { link: "vault", datas, columns }
) {
  const columns = props.columns;
  const data = props.datas;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <Table {...getTableProps()}>
      <Thead>
        <Tr {...headerGroups[0].getHeaderGroupProps()}>
          {headerGroups[0].headers.map((column) => (
            <Th
              key={column.Header}
              {...column.getHeaderProps(column.getSortByToggleProps())}
              isNumeric={column.isNumeric}
            >
              {column.render("Header")}
              <chakra.span pl="4">
                {column.isSorted ? (
                  column.isSortedDesc ? (
                    <TriangleDownIcon aria-label="sorted descending" />
                  ) : (
                    <TriangleUpIcon aria-label="sorted ascending" />
                  )
                ) : null}
              </chakra.span>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell, index) =>
                index === 0 ? (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    <Link
                      href={"/" + props.link + "/" + row.original["address"]}
                    >
                      {cell.render("Cell")}
                    </Link>
                  </Td>
                ) : (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render("Cell")}
                  </Td>
                )
              )}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
