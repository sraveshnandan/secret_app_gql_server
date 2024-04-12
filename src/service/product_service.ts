import { GraphQLError } from "graphql";
import { VerifyToken } from "./user_service";
import { Product } from "../models/product.model";
import { Shop } from "../models/shop.model";

const createProduct = async (data: any) => {
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

const getAllProduct = async () => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .populate("owner reviews  likes category");
    if (products.length <= 0) {
      return new GraphQLError("No products yet.");
    }
    return products;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const updateProduct = async (data: any) => {
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
          message: `Product updated successfully.`,
          data: updatedProduct,
        };
      }
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const likeProduct = async (data) => {
  try {
    const { token, productId } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    let product = await Product.findById(productId).populate(
      "owner category likes "
    );
    if (!product) {
      return new GraphQLError("Invalid Product Id, NO product Found.");
    }
    const likeIndex = product.likes.findIndex(
      (p) => p._id.toString() === user._id.toString()
    );
    console.log("index", likeIndex);
    if (likeIndex === -1) {
      product.likes.push(user._id);
      await product.save();

      return `${product.title} liked successfully.`;
    } else {
      product.likes.splice(likeIndex, 1);
      await product.save();
      return `${product.title} unliked successfully.`;
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};
const deleteProduct = async (data: { productId: string; token: string }) => {
  try {
    const { productId, token } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    // finding product
    let product = await Product.findById(productId).populate("owner");
    let shop = await Shop.findOne({ owner: user._id }).populate("owner");
    // Error handling

    if (!product && !shop) {
      return new GraphQLError("Invalid Id, No product found.");
    }

    // Check if the user is the owner of the shop

    if (shop?.owner?._id.toString() !== user._id.toString()) {
      console.log("shop owner", shop.owner);
      console.log("user", user._id);
      return new GraphQLError("You are no authorise to perform this task")
    }

    // Remove product from shop's products array
    const sId = shop._id;
    await Shop.updateOne({ _id: sId }, { $pull: { products: productId } });

    // Delete the product from the product collection
    await Product.deleteOne({ _id: productId });

    return "Product deleted successfully";
  } catch (error: any) {
    return new GraphQLError(error.message);
  }
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  likeProduct,
};
