import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "variables.env" });

import { ApolloServer } from "apollo-server";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import User from "./models/User";

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    try {
      if (token) {
        console.log(token);
        const currentUser = await jwt.verify(token, process.env.SECRET);
        console.log(currentUser);
        return { currentUser };
      }
    } catch (error) {
      console.log(error);
    }
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => console.log(err));

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
