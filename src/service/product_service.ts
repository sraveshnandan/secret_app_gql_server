import { GraphQLError } from "graphql";
import { VerifyToken } from "./user_service";
import { Product } from "../models/product.model";
import { Shop } from "../models/shop.model";

export const createProduct = async (data: any) => {
  try {
    const { token } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    delete data.token;

    if (user.isShopOwner) {
      let product = await Product.create(data);
      let shop = await Shop.findOne({ owner: user._id });
      shop.products.push(product._id);
      await shop.save();

      return {
        message: `Product created successfully : ${product.title}`,
        data: product,
      };
    }
    return new GraphQLError("You are not authorised to perform this task.");
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const getAllProduct = async () => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).populate("owner reviews  likes category");
    if (products.length <= 0) {
      return new GraphQLError("No products yet.");
    }
    return products;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const updateProduct = async (data: any) => {
  try {
    const { token, id } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    delete data.token;
    delete data.id;
    let product = await Product.findById(id).populate("owner category");
    let shop = await Shop.findOne({ owner: user._id });
    if (!product) {
      return new GraphQLError("Invalid ID, No product found.");
    }
    if (product.owner._id.toString() === shop._id.toString()) {
      console.log(`${user.name} is the creater of this product.`);
      let updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        { ...data },
        { new: true }
      );

      if (updatedProduct) {
        return {
          message:`Product updated successfully.`,
          data:updatedProduct
        }
        
      }
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};
