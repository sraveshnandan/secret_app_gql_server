import { Schema, model, Document, Types } from "mongoose";

interface IReview {
  user: Types.ObjectId;
  star: number;
  message: string;
}

interface IProduct extends Document {
  title: string;
  description: string;
  images: { public_id: string; url: string }[];
  category: Types.ObjectId[];
  original_price: number;
  discount_price: number;
  ratings: number;
  reviews: IReview[];
  extra: { name: string; value: string }[];
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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

const ProductSchema = new Schema<IProduct>(
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
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
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

export const Product = model<IProduct>("Product", ProductSchema);
