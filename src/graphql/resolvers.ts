import { GraphQLError } from "graphql";
import { StatusInfo } from "../utils";

export const resolvers = {
  Query: {
    status: async (_, { secret }) => {
      const res = StatusInfo(secret);
      if (res === null) {
        return new GraphQLError("Invalid secret provided.");
      }
      return res;
    },
  },
  Mutation:{
    
  }
};
