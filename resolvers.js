import Recipe from "./models/Recipe";
import User from "./models/User";
import jwt from "jsonwebtoken";

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

export const resolvers = {
  Query: {
    getAllRecipes: async (root, args) => {
      const allRecipes = await Recipe.find().exec();
      return allRecipes;
    }
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, description, category, instructions, username }
    ) => {
      const newRecipe = await Recipe.create({
        name,
        description,
        category,
        instructions,
        username
      });
      return newRecipe;
    },
    signupUser: async (root, { username, email, password }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error("User already exists");
      const newUser = await User.create({ username, email, password });
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
