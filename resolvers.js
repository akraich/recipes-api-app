import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Recipe from "./models/Recipe";
import User from "./models/User";

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

export const resolvers = {
  Query: {
    getAllRecipes: async (root, args) => {
      const allRecipes = await Recipe.find().exec();
      return allRecipes;
    },
    getCurrentUser: async (root, args, context) => {
      console.log(context);
      if (!context.currentUser) return null;
      const user = await User.findOne({
        username: context.currentUser.username
      });
      if (!user) throw new Error("User not found");
      return user;
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
    signinUser: async (root, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Wrong password");
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    signupUser: async (root, { username, email, password }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error("User already exists");
      const newUser = await User.create({ username, email, password });
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
