import { GraphQLError } from "graphql";
import { VerifyToken } from "./user_service";
import { Shop } from "../models/shop.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

export const createShop = async (data: {
  token: string;
  data: { address: string; name: string; description: string };
}) => {
  try {
    const { name, description, address } = data.data;
    const { token } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    const newShopData = {
      name,
      description,
      owner: user._id,
      address,
    };
    let shop = await Shop.create(newShopData);
    let newuser = await User.findById(user._id);
    newuser.isShopOwner = true;
    await newuser.save();

    return shop;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const getAllShop = async (token: string) => {
  try {
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    const shops = await Shop.find({})
      .populate("owner products followers")
      .sort({ createdAt: -1 });
    if (shops.length <= 0) {
      return new GraphQLError("No Shop yet.");
    }
    return shops;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const updateShop = async (data) => {
  try {
    let { token, data: payload } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    const { id } = data.data;
    let shop = await Shop.findById({ _id: id }).populate("owner");
    if (!shop) {
      return new GraphQLError("Invalid shop Id, No shop found.");
    }
    if (shop.owner._id.toString() === user._id.toString()) {
      delete payload.id;
      const { name, description, address } = payload;
      let updatedShop = await Shop.findByIdAndUpdate(
        { _id: id },
        { name, description, address },
        { new: true }
      ).populate("owner");
      if (updatedShop) {
        return { message: `Data updated successfully.`, data: updatedShop };
      }
    }
    return new GraphQLError("You are not allowed to perform this action.");
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const deleteShop = async (data: { id: string; token: string }) => {
  try {
    const { id, token } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    const shop = await Shop.findById(id).populate("owner");
    if (user._id.toString() === shop.owner._id.toString()) {
      //checking if any product is in this shop
      if (shop.products.length > 0) {
        shop.products.map(async (p) => {
          await Product.findByIdAndDelete(p._id);
          console.log(`All products deleted from shop : ${shop.name}`);
        });
      }

      //removing shop from all shop followers documents
      if (shop.followers.length > 0) {
        shop.followers.map(async (f) => {
          let user = await User.findById(f._id);
          const shopIndex = user.shops.findIndex(
            (s) => s.toString() === shop._id.toString()
          );
          if (shopIndex !== -1) {
            user.shops.splice(shopIndex, 1);
          }
        });
      }
      await Shop.findByIdAndDelete(id);

      return `Shop deleted successfully.`;
    }
    return new GraphQLError("You are not authorised to perform this task.");
  } catch (error) {
    return new GraphQLError(error.message);
  }
};
