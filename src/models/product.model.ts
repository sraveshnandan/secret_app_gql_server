import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    star: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      required: [true, "Review message is required."],
    },
  },
  { timestamps: true }
);
const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product title required."],
      minlength: [10, "Product title must be at least 10 characters long."],
    },
    description: {
      type: String,
      required: [true, "Product description required."],
      minlength: [
        50,
        "Product description must be at least 50 characters long.",
      ],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    original_price: {
      type: Number,
      required: [true, "Product original_price is required."],
    },
    discount_price: {
      type: Number,
      required: [true, "Product discount_price is required."],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [ReviewSchema],
    extra: [
      {
        name: String,
        value: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
