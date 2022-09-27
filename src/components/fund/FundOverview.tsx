import { Image, Box, Flex, Stack, Text } from "@chakra-ui/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { VaultChart } from "components/fund/VaultChart";
import { DepositButton } from "components/buttons/DepositButton";
import { WithdrawButton } from "components/buttons/WithdrawButton";
import BasicStatistics from "components/fund/VaultInfo";

interface Props {
  priceChartData: [];
  name: string;
  description: string;
  aum: number;
  averageMonthlyReturn: number;
  averageMonthlyGrowth: number;
  denominatedAssetName: string;
  comptrollerProxyAddress: string;
  vaultProxyAddress: string;
  denominatedAssetAddress: string;
  depositers: number;
}
export const FundOverview = (props: Props) => {
  const basicStaticData = {
    aum: props.aum,
    averageMonthlyReturn: props.averageMonthlyReturn,
    averageMonthlyGrowth: props.averageMonthlyGrowth,
    denominatedAssetName: props.denominatedAssetName,
    denominatedAssetAddress: props.denominatedAssetAddress,
    depositers: props.depositers,
  };

  return (
    <>
      <Box w="100%" h="100%">
        <Box w="100%" h="60%">
          <Flex>
            {" "}
            <Box w="80%">
              <Stack spacing={1} p={5}>
                <Box>
                  <Flex>
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                    />
                    <Box ml={5}>
                      <Text fontSize="2xl">{props.name}</Text>
                      <Text fontSize="1xl" color="gray">
                        {props.description}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Stack>
            </Box>
            <Flex w="40%">
              <Box p={5}>
                <DepositButton
                  comptrollerProxyAddress={props.comptrollerProxyAddress}
                  denominatedAssetAddress={props.denominatedAssetAddress}
                  vaultProxyAddress={props.vaultProxyAddress}
                />
              </Box>
              <Box p={5}>
                <WithdrawButton
                  comptrollerProxyAddress={props.comptrollerProxyAddress}
                  denominatedAssetAddress={props.denominatedAssetAddress}
                  vaultProxyAddress={props.vaultProxyAddress}
                />
              </Box>
            </Flex>
          </Flex>
          <Flex>
            <VaultChart priceChartData={props.priceChartData} />
          </Flex>
        </Box>
        <Box w="100%" h="40%" mt={10}>
          <BasicStatistics data={basicStaticData} />
        </Box>
      </Box>
    </>
  );
};
