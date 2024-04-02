import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { resolvers, typeDefs } from "./graphql";
import { MongoDbUri, Port } from "./config";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  console.log(`Connecting to Database.....`);
 
  mongoose
    .set("strictPopulate", false)
    .connect(MongoDbUri)
    .then(async (con) => {
      console.log(`📡 Databse is connected to : ${con.connection.host}`);
      console.log(`Starting GraphQl Server.`);
      
      const { url } = await startStandaloneServer(server, {
        listen: { port: Number(Port) },
        context: async ({ req, res }) => {
          return req.headers;
        },
      });
      console.log(`🔗 Graphql Server is running on :${url}`);
    })
    .catch((error) =>
      console.log(`Unable to connect to the database due to : ${error.message}`)
    );
};

startServer();
