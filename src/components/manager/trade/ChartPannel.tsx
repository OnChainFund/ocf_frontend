import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { SimpleChart } from "components/chart/SimpleChart";

const GET_ASSET_PRICE = gql`
  query GET_VAULT_DETAIL($address: ID!) {
    asset(pk: $address) {
      price {
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
  const address = props.assetAddress;
  const { data, loading, error } = useQuery(GET_ASSET_PRICE, {
    variables: { address },
  });

  if (loading) {
    return <>loading</>;
  }
  if (error) {
    return <>error</>;
  }

  return (
    <>
      <Box borderWidth="2px" borderRadius="lg" mr={10}>
        <Box pl={2} p={2}>
          <Text>{props.assetName}</Text>
          <Text fontSize="3xl">{props.price.toFixed(2)} </Text>
        </Box>
        <Box p={5}>
          <SimpleChart
            data={data.asset.price}
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
