import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  //uri: "https://countries.trevorblades.com",
  //uri: "https://ocf-backend.up.railway.app/graphql",
  uri: "http://127.0.0.1:8000/graphql",
  cache: new InMemoryCache(),
});

export default client;
