import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  stat: string;
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"2"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <StatLabel fontWeight={"medium"}>{title}</StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"small"}>
        {stat}
      </StatNumber>
    </Stat>
  );
}
interface Props {
  aum: number;
  averageMonthlyReturn: number;
  averageMonthlyGrowth: number;
  depositers: number;
  denominatedAssetName: string;
}
export default function BasicStatistics(props: Props) {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
        <Stat
          px={{ base: 4, md: 8 }}
          py={"2"}
          shadow={"xl"}
          border={"1px solid"}
          borderColor={useColorModeValue("gray.800", "gray.500")}
          rounded={"lg"}
        >
          <StatLabel>{"Assets Under Management"}</StatLabel>
          <StatNumber>
            {"$"}
            {props.aum.toFixed(2)}
          </StatNumber>
        </Stat>
        <Stat
          px={{ base: 4, md: 8 }}
          py={"2"}
          shadow={"xl"}
          border={"1px solid"}
          borderColor={useColorModeValue("gray.800", "gray.500")}
          rounded={"lg"}
        >
          <StatLabel>{"Depositors"}</StatLabel>
          <StatNumber>{props.depositers}</StatNumber>
        </Stat>

        <Stat
          px={{ base: 4, md: 8 }}
          py={"2"}
          shadow={"xl"}
          border={"1px solid"}
          borderColor={useColorModeValue("gray.800", "gray.500")}
          rounded={"lg"}
        >
          <StatLabel>{"Average Monthly Return"}</StatLabel>
          <StatNumber>
            {"$"}
            {props.averageMonthlyReturn.toFixed(2)}
          </StatNumber>
          <StatHelpText>
            <StatArrow
              type={props.averageMonthlyGrowth >= 0 ? "increase" : "decrease"}
            />
            {props.averageMonthlyGrowth.toFixed(2)}
            {"%"}
          </StatHelpText>
        </Stat>
        <StatsCard
          title={"Denomination Asset"}
          stat={props.denominatedAssetName}
        />
      </SimpleGrid>
    </Box>
  );
}
