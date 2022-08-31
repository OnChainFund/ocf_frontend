import React, { ReactNode } from "react";
import { Center, Container, useColorModeValue, Flex } from "@chakra-ui/react";
import NavBar from "./NavBar";

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  return (
    <div>
      <NavBar />
      <Flex>
        {/*<SimpleSidebar />*/}

        <Container maxW="container.lg" py="5">
          {props.children}
        </Container>
        <Center
          as="footer"
          bg={useColorModeValue("gray.100", "gray.700")}
          p={6}
        ></Center>
      </Flex>
    </div>
  );
}
