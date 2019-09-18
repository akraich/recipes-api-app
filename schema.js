import { gql } from "apollo-server";

export const typeDefs = gql`
  type Recipe {
    _id: ID
    name: String!
    category: String!
    description: String!
    instructions: String!
    created: String
    likes: Int
    username: String
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    joined: String
    favorites: [Recipe]
  }

  type Token {
    token: String!
  }

  type Query {
    getAllRecipes: [Recipe]
  }

  type Mutation {
    addRecipe(
      name: String!
      description: String!
      category: String!
      instructions: String!
      username: String
    ): Recipe

    signupUser(username: String!, email: String!, password: String!): Token
  }
`;
