import { Box, Flex, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { useEffect, useState } from "react";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import { default as ERC20ABI } from "abis/ERC20.json";
import AmountInputBox from "./AmountInputBox";
import { useAccount, useContractReads } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { Asset } from "types/asset";
import { Assets } from "pages/api/mocks/assets";
import { ReadContract } from "types/contract";
import ERC20BalanceInterface from "../../../abis/newFormat/ERC20/balance.json";
import { nodeProvider } from "app/feature/utils/basic";
import { ethers } from "ethers";
import PangolinRouterGetAmountsOut from "../../../abis/newFormat/Pangolin/PangolinRouter/getAmountsOut.json";
import { SimpleChart } from "components/chart/SimpleChart";
interface Prop {
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
}

export default function TradePannel(props: Prop) {
  const { address, isConnected } = useAccount();
  const [tradingInfo, setTradingInfo] = useState({
    fromAsset: Assets[0],
    toAsset: Assets[2],
    inputAmount: "0",
    outputAmount: "0",
    price: 0,
  });

  // 1: Input, 2: Output
  async function resetAmount(type: 1 | 2, value: string) {
    if (typeof tradingInfo.inputAmount === "string") {
      if (type === 1) {
        // USDT 搭配任一幣種
        // 非 USDT 幣種搭配(兩階段 1.換成 USDT 2.換成指定幣種)

        let outputAmount = "0";
        if (Number(value) > 0) {
          // USD 搭配任一幣種
          if (
            tradingInfo.fromAsset.address === Addresses.USDT ||
            tradingInfo.toAsset.address === Addresses.USDT
          ) {
            const pangolinRouter = new ethers.Contract(
              Addresses.pangolin.Router,
              [PangolinRouterGetAmountsOut],
              nodeProvider
            );
            const amount = await pangolinRouter.getAmountsOut(
              ethers.utils.parseUnits(Number(value).toFixed(2), 18),
              [tradingInfo.fromAsset.address, tradingInfo.toAsset.address]
            );
            outputAmount = (Number(amount[1]) / 1e18).toString();
          } else {
            const pangolinRouter = new ethers.Contract(
              Addresses.pangolin.Router,
              [PangolinRouterGetAmountsOut],
              nodeProvider
            );
            const amountUSD = await pangolinRouter.getAmountsOut(
              ethers.utils.parseUnits(Number(value).toFixed(2), 18),
              [tradingInfo.fromAsset.address, Addresses.USDT]
            );
            const amountOutPutAsset = await pangolinRouter.getAmountsOut(
              amountUSD[1],
              [Addresses.USDT, tradingInfo.toAsset.address]
            );
            outputAmount = (Number(amountOutPutAsset[1]) / 1e18).toString();
          }
        }

        setTradingInfo({
          ...tradingInfo,
          inputAmount: value,
          outputAmount: outputAmount,
          price: Number(outputAmount) / Number(value),
        });
      } else {
        setTradingInfo({ ...tradingInfo, outputAmount: value });
      }
    }
  }
  function switchTradingPair() {
    setTradingInfo({
      fromAsset: tradingInfo.toAsset,
      toAsset: tradingInfo.fromAsset,
      inputAmount: tradingInfo.outputAmount,
      outputAmount: tradingInfo.inputAmount,
      price: tradingInfo.price === 0 ? 0 : 1 / tradingInfo.price,
    });
  }
  function resetAsset(type: 1 | 2, asset: Asset) {
    if (type === 1) {
      // 兩個一樣 -> 全部互換
      if (asset.address === tradingInfo.toAsset.address) {
        switchTradingPair();
      } else {
        // 兩個不同
        setTradingInfo({ ...tradingInfo, fromAsset: asset });
      }
    } else {
      if (asset.address === tradingInfo.fromAsset.address) {
        switchTradingPair();
      } else {
        // 兩個不同
        setTradingInfo({ ...tradingInfo, toAsset: asset });
      }
    }
  }

  let contracts: ReadContract[] = [];
  for (let index = 0; index < Assets.length; index++) {
    contracts.push({
      addressOrName: Assets[index].address,
      contractInterface: [ERC20BalanceInterface],
      functionName: "balanceOf",
      args: [props.vaultProxyAddress],
    });
  }
  const { data, isError, isLoading } = useContractReads({
    contracts: [...contracts],
    allowFailure: false,
  });

  if (!isConnected || isError || isLoading) {
    return <Text fontSize="2xl"> Not Connected </Text>;
  }
  const takeOrderArgs = pangolinTakeOrderArgs({
    minIncomingAssetAmount: Number(tradingInfo.inputAmount),
    outgoingAssetAmount: Number(tradingInfo.outputAmount),
    path: [tradingInfo.fromAsset.address, tradingInfo.toAsset.address],
  });

  const callArgs = callOnIntegrationArgs({
    adapter: Addresses.ocf.PangolinExchangeAdapter,
    encodedCallArgs: takeOrderArgs,
    selector: takeOrderSelector,
  });
  let assets = [];
  for (let index = 0; index < data.length; index++) {
    assets.push({
      title: Assets[index].title,
      address: Assets[index].address,
      balance: formatUnits(data[index], 18),
    });
  }

  const overBalanceError =
    Number(tradingInfo.fromAsset.balance) < Number(tradingInfo.inputAmount);
  //||
  //Number(tradingInfo.toAsset.balance) < Number(tradingInfo.outputAmount);
  const initialData = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];
  return (
    <>
      <Flex>
        <Box borderWidth="2px" borderRadius="lg" mr={10}>
          <Box pl={2} p={2}>
            <Text>
              {tradingInfo.fromAsset.title}/{tradingInfo.toAsset.title}
            </Text>
            <Text fontSize="3xl"> {tradingInfo.price.toFixed(5)} </Text>
          </Box>
          <Box p={5}>
            <SimpleChart
              data={initialData}
              colors={{
                backgroundColor: "white",
                lineColor: "#2962FF",
                textColor: "black",
                areaTopColor: "#2962FF",
                areaBottomColor: "rgba(41, 98, 255, 0.28)",
              }}
            />
          </Box>
        </Box>
        <Box>
          <Box
            borderWidth="2px"
            borderRadius="lg"
            w={"100%"}
            //bg={useColorModeValue("gray.300", "gray.900")}
          >
            <Box>
              <SimpleGrid columns={1} spacing={10}>
                <Box p={3}>
                  <Text fontSize="2xl"> Trade </Text>
                </Box>
                <Box>
                  <AmountInputBox
                    assets={assets}
                    asset={tradingInfo.fromAsset}
                    type={1}
                    amount={tradingInfo.inputAmount}
                    setAsset={resetAsset}
                    setAmount={resetAmount}
                  />

                  <AmountInputBox
                    assets={assets}
                    asset={tradingInfo.toAsset}
                    type={2}
                    amount={tradingInfo.outputAmount}
                    setAsset={resetAsset}
                    setAmount={resetAmount}
                  />
                </Box>

                <Spacer />

                <SendTransactionButton
                  buttonTitle={overBalanceError ? "Over Balance" : "Confirm"}
                  contractAddress={props.comptrollerProxyAddress}
                  contractInterface={[
                    {
                      inputs: [
                        {
                          internalType: "address",
                          name: "_extension",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "_actionId",
                          type: "uint256",
                        },
                        {
                          internalType: "bytes",
                          name: "_callArgs",
                          type: "bytes",
                        },
                      ],
                      name: "callOnExtension",
                      outputs: [],
                      stateMutability: "nonpayable",
                      type: "function",
                    },
                  ]}
                  functionName={"callOnExtension"}
                  functionArgs={[
                    Addresses.ocf.IntegrationManager,
                    IntegrationManagerActionId.CallOnIntegration,
                    callArgs,
                  ]}
                  functionEnabled={true}
                  notClickable={overBalanceError}
                ></SendTransactionButton>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
