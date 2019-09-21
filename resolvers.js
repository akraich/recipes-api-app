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
      const allRecipes = await Recipe.find()
        .sort({ created: "desc" })
        .exec();
      return allRecipes;
    },
    getUserRecipes: async (root, { username }) => {
      const userRecipes = await Recipe.find({ username })
        .sort({ created: "desc" })
        .exec();
      return userRecipes;
    },
    getRecipe: async (root, { _id }) => {
      const recipe = await Recipe.findOne({ _id });
      console.log(recipe);
      if (!recipe) throw new Error("No recipe is found");
      return recipe;
    },
    searchRecipes: async (root, { searchTerm }) => {
      if (searchTerm) {
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: "textScore" }
          }
        )
          .sort({ score: { $meta: "textScore" } })
          .exec();
        return searchResults;
      } else {
        const recipes = await Recipe.find()
          .sort({ likes: "desc", created: "desc" })
          .exec();
        return recipes;
      }
    },
    getCurrentUser: async (root, args, context) => {
      if (!context.currentUser) return null;
      const user = await User.findOne({
        username: context.currentUser.username
      }).populate({ path: "favorites", model: "Recipe" });
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
    deleteRecipe: async (root, { _id }) => {
      const deletedRecipe = await Recipe.findByIdAndRemove({ _id }).exec();
      return deletedRecipe;
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
