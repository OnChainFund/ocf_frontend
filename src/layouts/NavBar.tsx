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
import SignInButton from "components/buttons/SignInButton";
interface NavLinkItem {
  title: string;
  link: string;
  isExternal: boolean;
}

function NavLink(props: NavLinkItem) {
  const { title, link, isExternal } = props;

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
  const Links: NavLinkItem[] = [
    { title: "Home", link: "/", isExternal: false },
    { title: "Fund", link: "/funds", isExternal: false },

    { title: "Testing Page", link: "/test", isExternal: false },
    {
      title: "Docs",
      link: "https://onchainfund.github.io/doc/",
      isExternal: true,
    },
    //{ title: "Get Some Gas!", link: "/test", isExternal: true },
  ];
  Links.push({ title: "Manager", link: "/manager", isExternal: false });
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
          <Flex alignItems={"right"} w="55%">
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
                <Text>Fuji Faucet</Text>
              </Link>
            </Button>
            <Spacer />
            <GetMockedUSDT />
            <Spacer />
            <ConnectButton label="Connect to Wallet" chainStatus="name" />
            <Spacer />
            {/*<SignInButton />*/}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
