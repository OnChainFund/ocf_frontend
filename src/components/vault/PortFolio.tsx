/* eslint-disable react/jsx-key */
import { chakra, Box } from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";
import { tokenData } from "pages/api/mocks/portfolio";
import { DataTable } from "../DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Contract, Provider } from "ethcall";
import { nodeProvider } from "app/feature/basic";
import { default as ERC20ABI } from "abis/ERC20.json";
type TokenInfo = {
  address: string;
  name: string;
  balance: number;
  price: number;
  thisDay: number;
  value: number;
  allocation: number;
};
const columnHelper = createColumnHelper<TokenInfo>();

export const tokenColumns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Asset",
  }),
  columnHelper.accessor("balance", {
    cell: (info) => info.getValue(),
    header: "Balance",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("thisDay", {
    cell: (info) => (
      <p style={{ color: info.getValue() > 0 ? "green" : "red" }}>
        {info.getValue()} %
      </p>
    ),
    header: "This Day",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("value", {
    cell: (info) => <p>${info.getValue()}</p>,
    header: "Value",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("allocation", {
    cell: (info) => <p>{info.getValue()} %</p>,
    header: "Allocation",
    meta: {
      isNumeric: true,
    },
  }),
];

const GET_TRACT_ASSETS = gql`
  query GET_TRACT_ASSETS {
    assets {
      address
      name
    }
  }
`;

interface Props {
  link: string;
}
export default function PortFolio() {
  const router = useRouter();
  const { address } = router.query;
  const [vaultTokenData, setVaultTokenData] = useState([]);

  const { data, loading, error } = useQuery(GET_TRACT_ASSETS);
  const callData = async () => {
    const ethcallProvider = new Provider();
    await ethcallProvider.init(nodeProvider);
    // 獲取各個 token balance
    let txRequestArray = [];
    let txResultArray = [];

    for (let index = 0; index < data["assets"].length; index++) {
      const asset = data["assets"][index];
      const assetContract = new Contract(asset["address"], ERC20ABI["abi"]);
      const assetBalanceCall = assetContract.balanceOf(address);
      txRequestArray.push(assetBalanceCall);
    }
    if (txRequestArray.length > 0) {
      console.log(txRequestArray.length);
      txResultArray = await ethcallProvider.all(txRequestArray);
      console.log(txResultArray);
    }
    setVaultTokenData([]);
  };
  useEffect(() => {
    if (loading || error || !router.isReady) return;
    callData();
  }, [router, loading, error]);

  if (loading || !router.isReady) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Token Holdings
        </chakra.h1>
      </Box>
      <DataTable data={vaultTokenData} columns={tokenColumns} />
    </>
  );
}
