import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:8083/v1/graphql", {
  headers: { "x-hasura-admin-secret": "myadminsecretkey"},
});
