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
      <StatLabel fontWeight={"medium"} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"small"}>
        {stat}
      </StatNumber>
    </Stat>
  );
}

export default function BasicStatistics() {
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
          <StatNumber>{"$1,192,133.30"}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
        <StatsCard title={"Depositors"} stat={"147"} />
        <Stat
          px={{ base: 4, md: 8 }}
          py={"2"}
          shadow={"xl"}
          border={"1px solid"}
          borderColor={useColorModeValue("gray.800", "gray.500")}
          rounded={"lg"}
        >
          <StatLabel>{"Average Monthly Return"}</StatLabel>
          <StatNumber>{"$2080"}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {"-9.81%"}
          </StatHelpText>
        </Stat>
        <StatsCard title={"Denomination Asset"} stat={"DAI"} />
      </SimpleGrid>
    </Box>
  );
}
