import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  //uri: "https://ocf-backend.up.railway.app/graphql",
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});

export default client;
