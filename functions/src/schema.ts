import { gql } from "apollo-server-express";

const schema = gql`
  type User {
    id: String!
    username: String
    hasFullAccount: Boolean!
    samples: [Sample!]
  }

  input UpdateUser {
    username: String
    description: String
  }

  type FirebaseUser {
    id: String!
    email: String
  }

  type Query {
    hello: String
    me: User
    getSamples(ids: [String!]!): Boolean
  }

  type Token {
    token: String
  }

  type File {
    id: String!
  }

  type Tag {
    id: String!
    title: String!
    samples: [Sample!]
  }

  type Sample {
    name: String
    id: String!
    tags: [String]
    downloads: Int!
    user: User!
    url: String
  }

  input SampleInput {
    tagText: [String!]
    name: String
  }

  type Mutation {
    # Sign up handles firebase
    signUp(email: String!, password: String!): FirebaseUser
    updateUser(data: UpdateUser): User
    uploadSample(file: Upload!): File!
  }
`;

export default schema;
