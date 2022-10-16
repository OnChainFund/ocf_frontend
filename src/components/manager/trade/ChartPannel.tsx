import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { SimpleChart } from "components/chart/SimpleChart";

const GET_ASSET_PRICE = gql`
  query GET_VAULT_DETAIL($address: ID!) {
    asset(pk: $address) {
      ftxPrice {
        time
        value
      }
    }
  }
`;

interface Prop {
  assetName: string;
  assetAddress: string;
  price: number;
}
export function ChartPannel(props: Prop) {
  const assetAddress = props.assetAddress;
  const { data, loading, error } = useQuery(GET_ASSET_PRICE, {
    variables: { address: assetAddress },
  });
  if (loading) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }
  console.log(data.asset.ftxPrice);
  return (
    <>
      <Box borderWidth="2px" borderRadius="lg" mr={10}>
        <Box pl={2} p={2}>
          <Text>{props.assetName}</Text>
          <Text fontSize="3xl">
            {data.asset.ftxPrice.at(-1).value.toFixed(2)}{" "}
          </Text>
        </Box>
        <Box p={5}>
          <SimpleChart
            data={data.asset.ftxPrice}
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
    </>
  );
}
