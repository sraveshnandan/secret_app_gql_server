import { Schema, model } from "mongoose";

const ShopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Shop name is required."],
      minlength: [3, "Shop name must be at least 3 characters long."],
      unique:[true, "Shop name should be unique."]
    },
    description: {
      type: String,
      required: [true, "Shop description is required."],
      minlength: [10, "Shop description must be at least 10 charaters long."],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    location: {
      lat: Number,
      long: Number,
    },
    views: {
      type: Number,
      default: 0,
    },

    address: {
      type: String,
      required: [true, "Shop Address can't be  empty."],
    },
  },
  { timestamps: true }
);

export const Shop = model("Shop", ShopSchema);
