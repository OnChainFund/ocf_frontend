import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useAccount, useBalance } from "wagmi";
import { useForm } from "react-hook-form";
export function TestComponent() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    token: "0xd1Cc87496aF84105699E82D46B6c5Ab6775Afae4",
    cacheTime: 2_000,
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  function onSubmit(values) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }
  return (
    <>
      <Text>Test Component</Text>
      <div>Address:{address}</div>

      <div>
        Balance: {data?.formatted} {data?.symbol}
      </div>
      <Text>Test Form</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="name">First name</FormLabel>
          <Input
            id="name"
            placeholder="name"
            {...register("name", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>Error</FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
