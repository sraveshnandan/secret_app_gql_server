import { GraphQLError } from "graphql";
import { Authenticate, StatusInfo } from "../utils";
import {
  VerifyToken,
  createUser,
  loginUser,
  updatePassword,
} from "../service/user_service";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../service/category_service";
import { isContext } from "vm";
import { createShop, getAllShop, updateShop } from "../service/shop_service";
import { createProduct, getAllProduct, updateProduct } from "../service/product_service";

export const resolvers = {
  Query: {
    status: (_, { secret }) => {
      const res = StatusInfo(secret);
      if (res === null) {
        return new GraphQLError("Invalid Secret Key.");
      }
      return res;
    },
    login: async (_, { data }, context) => {
      return await Authenticate(
        context.secret,
        async () => await loginUser(data)
      );
    },
    profile: async (_, {}, context) => {
      const res = await VerifyToken(context.token);
      return res;
    },
    category: async (_, {}, context) => {
      return await Authenticate(context.secret, async () => {
        return await getAllCategory(context);
      });
    },
    shops: async (_, {}, context) => {
      return await Authenticate(context.secret, async () => {
        return await getAllShop(context.token);
      });
    },
    products: async (_, {},context)=>{
      return await Authenticate(context.secret, async () => {
        return await getAllProduct();
      });
    }
  },
  Mutation: {
    createUser: async (_, { data }) => {
      return await createUser(data);
    },
    updatePassword: async (_, { data }, context) => {
      await updatePassword(data, context.token);
    },
    // #Category Mutations
    createCategory: async (_, { name }, context) => {
      const data = {
        name,
        token: context.token,
      };
      return await createCategory(data);
    },
    updateCategory: async (_, { id, name }, context) => {
      const data = {
        id,
        name,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        return await updateCategory(data);
      });
    },
    deleteCategory: async (_, { id }, context) => {
      const data = {
        id,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        return await deleteCategory(data);
      });
    },

    // #Shop Mutation
    createShop: async (_, { data }, context) => {
      const payload = {
        data,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        const res = await createShop(payload);
        return res;
      });
    },
    updateShop: async (_, { data }, context) => {
      const payload = {
        data,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        const res = await updateShop(payload);
        return res;
      });
    },
    deleteShop: async (_, { id }, context) => {
      const payload = {
        id,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        const res = await updateShop(payload);
        return res;
      });
    },
    // Product Mutation Resolvers 
    createProduct: async (_, { data }, context) => {
      const payload = {
        ...data,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        const res = await createProduct(payload);
        return res;
      });
    },
    updateProduct: async(_,{data},context)=>{
      const payload = {
        ...data,
        token: context.token,
      };
      return await Authenticate(context.secret, async () => {
        const res = await updateProduct(payload);
        return res;
      });
    }
  },
};
