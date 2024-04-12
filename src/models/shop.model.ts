import { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { Document } from "mongoose";

interface IShop extends Document {
  name: string;
  description: string;
  images: { public_id: string; url: string }[];
  products: Types.ObjectId[];
  owner: Types.ObjectId;
  followers: Types.ObjectId[];
  location: { lat: number; long: number };
  views: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      required: [true, "Shop Name is required."],
      unique: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: [true, "Shop description is required."],
      minlength: [10, "Shop description must be at least 10 characters long."],
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

export const Shop = model<IShop>("Shop", ShopSchema);
