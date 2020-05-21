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
    title: String!
    samples: [Sample!]
  }

  type TagText {
    name: String!
  }

  type UserLink {
    id: String!
    name: String
  }

  type Sample {
    name: String
    id: String!
    tagLink: [TagText]
    downloads: Int!
    user: UserLink!
    url: String
  }

  input SampleInput {
    tagText: [String!]
    url: String!
    name: String!
  }

  type Mutation {
    # Sign up handles firebase
    signUp(email: String!, password: String!): FirebaseUser
    updateUser(data: UpdateUser): User
    newSample(sample: SampleInput!): Sample
  }
`;

export default schema;
