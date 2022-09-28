import { Box, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Addresses } from "abis/ocf/Address";
import {
  IntegrationManagerActionId,
  pangolinTakeOrderArgs,
} from "app/feature/pangolin";
import { takeOrderSelector } from "app/feature/utils/common";
import { SendTransactionButton } from "components/buttons/SendTransactionButton";
import { useState } from "react";
import { callOnIntegrationArgs } from "app/feature/utils/actions";
import { default as ERC20ABI } from "abis/ERC20.json";
import AmountInputBox from "./AmountInputBox";
import { useAccount, useContractReads } from "wagmi";
import { formatUnits } from "ethers/lib/utils";
import { Asset } from "types/asset";
interface Prop {
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
}

export default function TradePannel(props: Prop) {
  interface ReadContract {
    addressOrName: string;
    contractInterface: Array<any>;
    functionName: string;
    args: Array<any>;
  }
  const Assets: Asset[] = [
    {
      title: "USDT",
      address: "0xd1Cc87496aF84105699E82D46B6c5Ab6775Afae4",
      balance: "0.0",
    },
    {
      title: "WAVAX",
      address: "0x6cEeB8fec16F7276F57ACF70C14ecA6008d3DDD4",
      balance: "0.0",
    },
    {
      title: "WBTC ",
      address: "0xbC9052c594261Acc1a26271567bDb72A8A1Acac9",
      balance: "0.0",
    },
    {
      title: "WETH ",
      address: "0x96058B65CE7d0DBa4B85DAf49E06663B97442137",
      balance: "0.0",
    },
    {
      title: "LINK ",
      address: "0x5B3a2CAED90515e36830167529AFeDea75419b7a",
      balance: "0.0",
    },
    {
      title: "AAVE",
      address: "0x9Bb8F40d53DA2796F34d85f5bf27C475Df03E70C",
      balance: "0.0",
    },
    {
      title: "AAPL",
      address: "0x930b24b4b578409153501429cc256FBbDAB6e893",
      balance: "0.0",
    },
    {
      title: "GOOGL",
      address: "0x6499b7b57D07a9091eB7cE5548c086308a868Fe9",
      balance: "0.0",
    },
    {
      title: "GLD",
      address: "0x7D157E24f3D6FB7Bd8B3008A76DFBCde267daCa8",
      balance: "0.0",
    },
    {
      title: "TSLA",
      address: "0x22044e0e4E2D774f34227FC8a1BF804Ff9Fc9A35",
      balance: "0.0",
    },
    {
      title: "EUR",
      address: "0x3339f437Fd3abCdaD135446B6F05bB957Bb29c6A",
      balance: "0.0",
    },
    {
      title: "JPY",
      address: "0xa0D0693047cC189D5742160941c1703857616889",
      balance: "0.0",
    },
    {
      title: "TWTR",
      address: "0x181Bf62B82AFafa87630C819482ABbA819e49601",
      balance: "0.0",
    },
    {
      title: "BTCDOWN",
      address: "0xE85e1219691aF541F064E111161174C1F7Db2e84",
      balance: "0.0",
    },
    {
      title: "ETHDOWN",
      address: "0xB7B8E01a9F5dFe405c37b667E8F81a66D4f629EA",
      balance: "0.0",
    },
    {
      title: "USDTDOWN",
      address: "0x7f5BE805EFdbc5b42A3cfBC41B2961A0A9d9e3B2",
      balance: "0.0",
    },
    {
      title: "AAVEDOWN",
      address: "0x0690b3F6f8271b000f800F051f82B65F41D29C5E",
      balance: "0.0",
    },
    {
      title: "AAPLDOWN",
      address: "0xC7c69FFC3561fb3284F4d6D25d8b69D8CB3b59e9",
      balance: "0.0",
    },
    {
      title: "TWTRDOWN",
      address: "0xe05F46AAfa9919f722bc83fbD2Bb7B3Ac23E1Bc2",
      balance: "0.0",
    },
    {
      title: "GLDDOWN",
      address: "0xFb1438372dB41dAFFcf4019e80eAE2D673B8c3b7",
      balance: "0.0",
    },
    {
      title: "TSLADOWN",
      address: "0xa19baf63747637D0233702bA8F1eFcD6729db4DF",
      balance: "0.0",
    },
    {
      title: "LINKDOWN",
      address: "0xA964EeaE6e77B1d01432942bc31186cB56eA5804",
      balance: "0.0",
    },
    {
      title: "AVAXDOWN",
      address: "0x33506d382684db988D9021A80dBEeEF46a5ABC3A",
      balance: "0.0",
    },
  ];
  const { address, isConnected } = useAccount();
  const [fromAsset, setFromAsset] = useState(Assets[0]);
  const [toAsset, setToAsset] = useState(Assets[2]);
  const [inputAmount, setInputAmount] = useState("1.0");
  const [outputAmount, setOutputAmount] = useState("1.0");
  const ERC20BalanceInterface = [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  //const contracts = Assets.map((asset)=>{title: asset.title, address: asset.address})

  let contracts: ReadContract[] = [];
  for (let index = 0; index < Assets.length; index++) {
    contracts.push({
      addressOrName: Assets[index].address,
      contractInterface: ERC20BalanceInterface,
      functionName: "balanceOf",
      args: [props.vaultProxyAddress],
    });
  }
  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    allowFailure: false,
  });

  if (!isConnected || isError || isLoading) {
    return <Text fontSize="2xl"> Not Connected </Text>;
  }
  const takeOrderArgs = pangolinTakeOrderArgs({
    minIncomingAssetAmount: Number(inputAmount) * 1e18,
    outgoingAssetAmount: Number(outputAmount) * 1e18,
    path: [fromAsset.address, toAsset.address],
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
  console.log(assets);
  return (
    <>
      <Box>
        <SimpleGrid columns={1} spacing={10}>
          <Box p={3}>
            <Text fontSize="2xl"> Trade </Text>
          </Box>
          <Box>
            <AmountInputBox
              assets={assets}
              asset={fromAsset}
              setAsset={setFromAsset}
              amount={inputAmount}
              setAmount={setInputAmount}
            />

            <AmountInputBox
              assets={assets}
              asset={toAsset}
              setAsset={setToAsset}
              amount={outputAmount}
              setAmount={setOutputAmount}
            />
          </Box>

          <Spacer />

          <SendTransactionButton
            buttonTitle={"Confirm"}
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
            //notClickable={Number(fromAsset.balance)}
            notClickable={false}
          ></SendTransactionButton>
        </SimpleGrid>
      </Box>
    </>
  );
}
