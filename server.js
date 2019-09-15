import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "variables.env" });

import { ApolloServer } from "apollo-server";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => console.log(err));

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
