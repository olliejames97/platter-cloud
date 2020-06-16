import { gql } from "apollo-server-express";

const schema = gql`
  type User {
    id: String!
    username: String
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
    filetype: String!
  }

  input SampleInput {
    tagText: [String!]
    url: String!
    name: String!
    fileType: String!
  }

  type HomePage {
    text: String!
    samples: [Sample!]
  }

  type Mutation {
    # Sign up handles firebase
    signUp(email: String!, password: String!): FirebaseUser
    updateUser(data: UpdateUser): User
    newSample(sample: SampleInput!): Sample
    ping: Boolean
  }

  type Query {
    hello: String
    me: User
    getUser(id: String): User!
    getSamples(ids: [String!]!): Boolean
    searchSamples(tags: [String!]): [Sample!]
    home: HomePage
  }
`;

export default schema;
