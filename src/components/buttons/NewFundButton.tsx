import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useDebounce } from "use-debounce";
import { useAccount } from "wagmi";
import { useForm } from "react-hook-form";

interface Prop {}
export function NewFundButton(props: Prop) {
  const { address, isConnected } = useAccount();
  const format = (val: number) => `$` + val;
  const parse = (val: string) => Number(val.replace(/^\$\./, ""));
  const [value, setValue] = React.useState(0);
  const debouncedValue = useDebounce(value, 500);
  // updates the value if no change has been made for 500 milliseconds
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  function onSubmit(values) {
    alert(JSON.stringify(values, null, 2));
    onClose();
  }

  if (!isConnected) {
    return <Button disabled={true}>Not Connected</Button>;
  }

  return (
    <>
      <Button onClick={onOpen}>Create New Fund</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Fund</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel htmlFor="name">Fund name</FormLabel>
                <Input
                  id="name"
                  placeholder="name"
                  {...register("name", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>Error</FormErrorMessage>
                <FormLabel htmlFor="name">Fund symbol</FormLabel>
                <Input
                  id="symbol"
                  placeholder="symbol"
                  {...register("symbol")}
                />
                <FormErrorMessage>Error</FormErrorMessage>
                <FormLabel htmlFor="description">Fund description</FormLabel>
                <Input
                  id="description"
                  placeholder="description"
                  {...register("description", {
                    required: "This is required",
                  })}
                />
                <FormErrorMessage>Error</FormErrorMessage>
                <FormLabel htmlFor="denominatedAsset">
                  Denomination Asset
                </FormLabel>
                <Box ml={2}>USDT</Box>
                {/* <Input
                  id="denominatedAsset"
                  placeholder="denominated Asset"
                  {...register("denominatedAsset", {
                    required: "This is required",
                  })}
                /> */}
                <FormErrorMessage>Error</FormErrorMessage>
              </FormControl>
              <Flex>
                <Spacer />
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  mt={4}
                  ml={3}
                  isLoading={isSubmitting}
                  type="submit"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
