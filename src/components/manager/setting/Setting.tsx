import {
  Input,
  Box,
  Text,
  FormErrorMessage,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";

const EDIT_FUND_INFO = gql`
  mutation EditFund(
    $description: String!
    $detail: String!
    $vaultProxyAddress: String!
  ) {
    updateFunds(
      data: { description: $description, detail: $detail }
      filters: { vaultProxy: { iExact: $vaultProxyAddress } }
    ) {
      description
      detail
    }
  }
`;

interface Prop {
  name: string;
  description: string;
  vaultProxyAddress: string;
}
export default function Setting(props: Prop) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      description: props.description,
      detail: props.description,
    },
  });
  const [editFundInfo, { data, loading, error }] = useMutation(EDIT_FUND_INFO);

  function onSubmit(values) {
    editFundInfo({
      variables: {
        description: values.description,
        detail: values.detail,
        vaultProxyAddress: props.vaultProxyAddress,
      },
    });
  }

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <>
      <Text fontSize="3xl">Edit Fund Info: {props.name}</Text>
      <Box borderWidth="2px" p={4} mt={3} borderRadius="lg" w={"100%"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Box m={5}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                placeholder="description"
                {...register("description", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </Box>
            <Box m={5}>
              <FormLabel htmlFor="detail">About</FormLabel>
              <Textarea
                id="detail"
                placeholder="detail"
                {...register("detail", {
                  required: "This is required",
                })}
                h={"500"}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </Box>
          </FormControl>
          <Flex>
            <Spacer />{" "}
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
}
