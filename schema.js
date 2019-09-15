import { gql } from "apollo-server";

export const typeDefs = gql`
  type Recipe {
    name: String!
    category: String!
    description: String!
    instructions: String!
    created: String
    likes: Int
    username: String
  }

  type User {
    username: String!
    email: String!
    password: String!
    joined: String
    favorites: [Recipe]
  }

  type Query {
    getAllRecipes: [Recipe]
  }
`;
