/* eslint-disable react/jsx-key */
import { chakra, Box } from "@chakra-ui/react";
import { DepositerData, Depositercolumns } from "pages/api/mocks/depositer";
import { DataTable } from "../DataTable";

interface Props {
  name: string;
  detail: string;
}
export default function About(props: Props) {
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          About {props.name}
        </chakra.h1>
        {props.detail}
      </Box>
    </>
  );
}
