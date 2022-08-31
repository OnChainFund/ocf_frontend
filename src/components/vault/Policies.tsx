/* eslint-disable react/jsx-key */
import {
  chakra,
  Box,
} from "@chakra-ui/react";
import { tokenData, tokenColumns } from "pages/api/mocks/portfolio";
import { DataTable } from "../DataTable";

interface Props {
  link: string;
}
export default function Policies() {
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Token Holdings
        </chakra.h1>
      </Box>
      <DataTable data={tokenData} columns={tokenColumns} />
    </>
  );
}
