import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Link,
  useDisclosure,
  useColorModeValue,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { GetMockedUSDT } from "components/buttons/GetMockedUSDT";
interface NavLinkItem {
  title: string;
  link: string;
  isExternal: boolean;
}
const Links: NavLinkItem[] = [
  { title: "Home", link: "/", isExternal: false },
  { title: "Vault", link: "/vaults", isExternal: false },
  { title: "Manager", link: "/manager", isExternal: false },

  { title: "Testing Page", link: "/test", isExternal: false },
  {
    title: "Docs",
    link: "https://onchainfund.github.io/doc/",
    isExternal: true,
  },
  //{ title: "Get Some Gas!", link: "/test", isExternal: true },
];

function NavLink(props: NavLinkItem) {
  const { title, link, isExternal } = props;
  const bg = useColorModeValue("gray.200", "gray.700");

  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
      }}
      href={link}
      isExternal={isExternal}
    >
      {title}
    </Link>
  );
}

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  function titleCaseWord(word: string) {
    if (!word) return word;
    let modified = (" " + word).slice(1);
    return modified[0].toUpperCase() + modified.substr(1).toLowerCase();
  }
  return (
    <>
      <Box bg={useColorModeValue("gray.300", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((item) => (
                <NavLink
                  key={item.title}
                  title={item.title}
                  link={item.link}
                  isExternal={item.isExternal}
                />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"right"} w="45%">
            <Button>
              <Link
                href="https://faucet.avax.network/"
                isExternal
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
              >
                <Text>Get Some Gas!</Text>
              </Link>
            </Button>
            <Spacer />
            <GetMockedUSDT />
            <Spacer />
            <ConnectButton label="Connect to Wallet" chainStatus="name" />
          </Flex>
        </Flex>

        {isOpen ? <Box pb={4} display={{ md: "none" }}></Box> : null}
      </Box>
    </>
  );
}
