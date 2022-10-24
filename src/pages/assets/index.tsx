import Head from "next/head";
import type { NextPageWithLayout } from "../../types/page";
import { Box, chakra, Text } from "@chakra-ui/react";
import { DataTable } from "components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import AssetListCard from "components/assets/AssetListCard";
import { Assets, AssetsToPoolAddress } from "pages/api/mocks/assets";
import { useContractReads } from "wagmi";
import { ReadContract } from "types/contract";
import ChainLinkLatestAnswerInterface from "../../abis/newFormat/ChainLinkAggregatorV3/latestAnswer.json";
import { Addresses } from "abis/ocf/Address";
import PangolinRouterGetAmountsOut from "../../abis/newFormat/Pangolin/PangolinRouter/getAmountsOut.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { default as ERC20 } from "abis/ERC20.json";
//
type AssetType = {
  address: string;
  name: string;
  dexPrice: number;
  dexLiquidity: number;
  oraclePrice: number;
};

interface pageDataType {
  depositorCount: number;
  AUMSum: number;
  table: AssetType[];
}

const columnHelper = createColumnHelper<AssetType>();

const AssetsPage: NextPageWithLayout = () => {
  const [assetsData, setAssetsData] = useState<AssetType[]>([]);
  let contracts: ReadContract[] = [];
  // get balance
  for (let index = 0; index < Assets.length; index++) {
    if (Assets[index].title === "USDT") {
      contracts.push(
        {
          addressOrName: Addresses.pangolin.Router,
          contractInterface: [PangolinRouterGetAmountsOut],
          functionName: "getAmountsOut",
          args: [
            ethers.utils.parseUnits("1", 18),
            [Addresses.WAVAX, Assets[index].address],
          ],
        },
        {
          addressOrName: Assets[index].priceFeed,
          contractInterface: [ChainLinkLatestAnswerInterface],
          functionName: "latestAnswer",
          args: [],
        },
        {
          addressOrName: Addresses.WAVAX,
          contractInterface: ERC20["abi"],
          functionName: "balanceOf",
          args: [Addresses.USDT], // account
        }
      );
    } else {
      //console.log(Assets[index].address);
      // console.log(
      //   Assets[index].address +
      //     "pool" +
      //     AssetsToPoolAddress[Assets[index].address]
      // );
      contracts.push(
        {
          addressOrName: Addresses.pangolin.Router,
          contractInterface: [PangolinRouterGetAmountsOut],
          functionName: "getAmountsOut",
          args: [
            ethers.utils.parseUnits("1", 18),
            [Assets[index].address, Addresses.USDT],
          ],
        },
        {
          addressOrName: Assets[index].priceFeed,
          contractInterface: [ChainLinkLatestAnswerInterface],
          functionName: "latestAnswer",
          args: [],
        },
        {
          addressOrName: Addresses.USDT,
          contractInterface: ERC20["abi"],
          functionName: "balanceOf",
          args: [AssetsToPoolAddress[Assets[index].address]], // account
        }
      );
    }
  }
  // get value now
  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    allowFailure: false,
    cacheTime: 100_000,
  });

  const AssetColumns = [
    columnHelper.accessor("name", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Name",
    }),
    columnHelper.accessor("dexPrice", {
      cell: (info) => info.getValue().toFixed(2),
      header: "Price On DEX(Pangolin Swap)",
    }),

    columnHelper.accessor("oraclePrice", {
      cell: (info) => info.getValue().toFixed(2),
      header: "Price On Oracles",
    }),
    columnHelper.accessor("dexLiquidity", {
      cell: (info) => (info.getValue() * 2).toFixed(2),
      header: "Liquidity On DEX(Pangolin Swap)",
    }),
  ];
  const callData = () => {
    // 重置 asset data
    setAssetsData([]);
    // 重新為 asset data 賦值
    let tempAssetData = [];
    for (var index in Assets) {
      if (Assets[index].title === "USDT") {
        tempAssetData.push({
          address: Assets[index].address,
          name: Assets[index].title,
          dexPrice: 1.0,
          dexLiquidity: 0.0,
          oraclePrice: 1.0,
        });
      } else {
        tempAssetData.push({
          address: Assets[index].address,
          name: Assets[index].title,
          dexPrice: Number(data[Number(index) * 3][1]) / 1e18,
          oraclePrice: Number(data[Number(index) * 3 + 1]) / 1e8,
          dexLiquidity: Number(data[Number(index) * 3 + 2]) / 1e18,
        });
      }
      setAssetsData(tempAssetData);
    }
  };
  useEffect(() => {
    if (isError || isLoading) return;
    callData();
  }, [data, isError, isLoading]);
  // console.log(data);
  return (
    <>
      <Head>
        <title>Assets</title>
      </Head>
      <>
        <AssetListCard assetCount={Assets.length} AUMSum={1000000} />
        <Box mt={50}>
          <DataTable data={assetsData} columns={AssetColumns} />
        </Box>
      </>
    </>
  );
};

export default AssetsPage;
