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

  type Mutation {
    # Sign up handles firebase
    signUp(username: String!, password: String!): User
  }
`;

export default schema;
