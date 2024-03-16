import { GraphQLError } from "graphql";
import { VerifyToken } from "./user_service";
import { User } from "../models/user.model";
import { Category } from "../models/category.model";

export const createCategory = async (data: { name: string; token: string }) => {
  try {
    const { name, token } = data;
    const res = await VerifyToken(token);
    console.log(res)
    const user = JSON.parse(JSON.stringify(res)).user;
    console.log(user)
    if (user.isAdmin !== true) {
      return new GraphQLError("You are not authorise  to perform this task.");
    }
    const newCatData = {
      name,
      createdBy: user._id,
    };
    let category = await Category.create(newCatData);
    return `Category created with name: ${category.name}`;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const getAllCategory = async (context) => {
  try {
    const { token } = context;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;

    if (!user) {
      return new GraphQLError("Unauthenticated, Please login to continue.");
    }

    const category = await Category.find({})
      .populate("createdBy")
      .sort({ createdAt: -1 });

    if (category.length <= 0) {
      return new GraphQLError("No category yet.");
    }

    return category;
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const updateCategory = async (data) => {
  try {
    const { token, id, name } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    let category = await Category.findById(id).populate("createdBy");
    if (!category) {
      return new GraphQLError("Invalid Id, No category found.");
    }

    if (
      user.isAdmin === true ||
      category.createdBy._id.toString() === user._id.toString()
    ) {
      const res = await Category.findByIdAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );

      if (res) {
        return `Category updated successfully. with new name: ${name}`;
      }
      return new GraphQLError("Something went wrong at our end.");
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

export const deleteCategory = async (data) => {
  try {
    const { token, id } = data;
    const res = await VerifyToken(token);
    const user = JSON.parse(JSON.stringify(res)).user;
    let category = await Category.findById(id).populate("createdBy");
    if (!category) {
      return new GraphQLError("Invalid Id, No category found.");
    }

    if (
      user.isAdmin === true ||
      category.createdBy._id.toString() === user._id.toString()
    ) {
      const res = await Category.findByIdAndDelete(id);
      if (res) {
        return "Category deleted successfully.";
      }
      return new GraphQLError("Something went wrong at our end.");
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};
