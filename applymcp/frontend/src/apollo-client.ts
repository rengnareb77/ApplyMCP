import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql"

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
