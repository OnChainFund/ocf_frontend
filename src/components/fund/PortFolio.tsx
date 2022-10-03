/* eslint-disable react/jsx-key */
import { chakra, Box, Text } from "@chakra-ui/react";
import { DataTable } from "../DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "@apollo/client";
import { useState } from "react";
import { Assets } from "pages/api/mocks/assets";
import { ReadContract } from "types/contract";
import { useContractReads } from "wagmi";
import ERC20BalanceInterface from "../../abis/newFormat/ERC20/balance.json";
import ChainLinkLatestAnswerInterface from "../../abis/newFormat/ChainLinkAggregatorV3/latestAnswer.json";
import { formatUnits } from "ethers/lib/utils";
type TokenInfo = {
  address: string;
  name: string;
  balance: number;
  assetPrice: number;
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
    cell: (info) => info.getValue().toFixed(2),
    header: "Balance",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("assetPrice", {
    cell: (info) => <p>${info.getValue().toFixed(2)}</p>,
    header: "Asset Price",
    meta: {
      isNumeric: true,
    },
  }),
  //columnHelper.accessor("thisDay", {
  //  cell: (info) => (
  //    <p style={{ color: info.getValue() > 0 ? "green" : "red" }}>
  //      {info.getValue()} %
  //    </p>
  //  ),
  //  header: "This Day",
  //  meta: {
  //    isNumeric: true,
  //  },
  //}),
  columnHelper.accessor("value", {
    cell: (info) => <p>${info.getValue().toFixed(2)}</p>,
    header: "Value",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("allocation", {
    cell: (info) => <p>{info.getValue().toFixed(2)} %</p>,
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

interface fundAssetDetailData {
  name: string;
  balance: number;
  assetPrice: number;
  //thisDay: number;
  value: number;
  allocation: number;
}

interface Prop {
  vaultProxyAddress: string;
  AUM: number;
}

export default function PortFolio(props: Prop) {
  const [vaultTokenData, setVaultTokenData] = useState([]);
  let contracts: ReadContract[] = [];
  // get balance
  for (let index = 0; index < Assets.length; index++) {
    contracts.push({
      addressOrName: Assets[index].address,
      contractInterface: [ERC20BalanceInterface],
      functionName: "balanceOf",
      args: [props.vaultProxyAddress],
    });
  }
  // get value now
  for (let index = 0; index < Assets.length; index++) {
    contracts.push({
      addressOrName: Assets[index].priceFeed,
      contractInterface: [ChainLinkLatestAnswerInterface],
      functionName: "latestAnswer",
      args: [],
    });
  }
  // get value 24H ago

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    allowFailure: false,
    cacheTime: 100_000,
  });
  if (isError || isLoading) {
    return <Text fontSize="2xl"> Something Wrong </Text>;
  }
  let assets: fundAssetDetailData[] = [];
  for (let index = 0; index < Assets.length; index++) {
    if (Number(formatUnits(data[index], 18)) !== 0) {
      assets.push({
        name: Assets[index].title,
        balance: Number(formatUnits(data[index], 18)),
        //thisDay: 0,
        assetPrice: Number(formatUnits(data[index + Assets.length], 8)),
        value:
          Number(formatUnits(data[index], 18)) *
          Number(formatUnits(data[index + Assets.length], 8)),
        allocation:
          ((Number(formatUnits(data[index], 18)) *
            Number(formatUnits(data[index + Assets.length], 8))) /
            props.AUM) *
          100,
      });
    }
  }

  return (
    <>
      <Box>
        <chakra.h1 textAlign={"left"} fontSize={"4xl"} fontWeight={"bold"}>
          Token Holdings
        </chakra.h1>
      </Box>
      <DataTable data={assets} columns={tokenColumns} />
    </>
  );
}
