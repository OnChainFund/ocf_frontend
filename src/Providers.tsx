import { ChakraProvider } from "@chakra-ui/react";
import { Store } from "@reduxjs/toolkit";
import { WagmiProvider } from "./wagmi/provider";

const Providers: React.FC<
  React.PropsWithChildren<{ children: React.ReactNode }>
> = ({ children }) => {
  return (
    <>
      <ChakraProvider>
        <WagmiProvider>{children}</WagmiProvider>
      </ChakraProvider>
    </>
  );
};

export default Providers;
