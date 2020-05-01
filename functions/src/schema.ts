import { gql } from "apollo-server-express";

const schema = gql`
  type User {
    _id: String!
    hasFullAccount: Boolean!
    username: String
  }

  type Query {
    hello: String
    me: User
  }
`;

export default schema;
