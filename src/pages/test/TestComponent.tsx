import { Text } from "@chakra-ui/react";
import React from "react";
import { useAccount, useBalance } from "wagmi";

export function TestComponent() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: "0xd1Cc87496aF84105699E82D46B6c5Ab6775Afae4",
    cacheTime: 2_000,   
  });
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <>
      <Text>Test Component</Text>
      <div>Address:{address}</div>

      <div>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </>
  );
}
