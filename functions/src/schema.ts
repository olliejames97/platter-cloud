import { gql } from "apollo-server-express";

const schema = gql`
  type User {
    id: String!
    hasFullAccount: Boolean!
    username: String
  }

  type FirebaseUser {
    id: String!
    email: String
  }

  type Query {
    hello: String
    me: User
  }

  type Mutation {
    # Sign up handles firebase
    signUp(email: String!, password: String!): FirebaseUser
  }
`;

export default schema;
