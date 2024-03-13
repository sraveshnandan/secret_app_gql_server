import { hash } from "bcrypt";
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required."],
    },
    email: {
      type: String,
      required: [true, "Emailaddress is required."],
    },
    password: {
      type: String,
      required: [true, "Password must be required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
    phone_no: {
      type: Number,
      minlength: [10, "Phone number must be at least 10 characters long."],
    },
    avatar: {
      public_id: { type: String, default: "Sample id." },
      url: { type: String, default: "Sample id." },
    },
    shops: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shop",
      },
    ],
    isShopOwner: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hashing the password autometically before saving it to the database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

export const User = model("User", UserSchema);
