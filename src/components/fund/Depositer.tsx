/* eslint-disable react/jsx-key */
import { chakra, Box } from "@chakra-ui/react";
import { DepositerData, Depositercolumns } from "pages/api/mocks/depositer";
import { DataTable } from "../DataTable";

interface Props {
  link: string;
}
export default function Depositer() {
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Depositers
        </chakra.h1>
      </Box>
      <DataTable data={DepositerData} columns={Depositercolumns} />
    </>
  );
}
