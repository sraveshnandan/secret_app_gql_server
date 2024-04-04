import { GraphQLError } from "graphql";
import { User } from "../models/user.model";
import { PasswordInput, UserInput } from "../types";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { GenerateOtp } from "../utils";
import { sendEmail } from "../lib";

const createUser = async (data: UserInput) => {
  try {
    let { name, email, password, avatar, phone_no } = data;
    let user = await User.findOne({ email });
    if (user) {
      return new GraphQLError("Email already exists.");
    }
    if (data.avatar === undefined) {
      data.avatar = {
        public_id: "dummy_image",
        url: "https://cdn-icons-png.flaticon.com/512/1458/1458201.png",
      };
    }
    data.phone_no = Number(phone_no);
    console.log("Phone number", data.phone_no);
    console.log("data", data);
    user = await User.create(data);
    return {
      message: `Account created : ${user.name} `,
      user,
    };
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const loginUser = async (data: UserInput) => {
  try {
    const { email, password } = data;

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new GraphQLError("Invalid email, No account found.");
    }

    const isPassOk = compareSync(password, user.password);
    if (!isPassOk) {
      return new GraphQLError("Incorrect password.");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    user.password = undefined;
    return {
      message: `Welcome MR.${user.name}`,
      user,
      token,
    };
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const VerifyToken = async (token: string) => {
  if (token || token !== "") {
    let decode = jwt.verify(token, JWT_SECRET);
    if (decode) {
      const data = JSON.stringify(decode);
      const id = JSON.parse(data).id;

      let user = await User.findById(id);
      if (!user || user === undefined) {
        return new GraphQLError(
          "Token invalid or expired, Please login again."
        );
      }
      return {
        message: `Data fetched successfully.`,
        user,
      };
    }
    return new GraphQLError("Invalid or expired token.");
  }

  return new GraphQLError("Invalid or no token provided.");
};

const updatePassword = async (data: PasswordInput, token: string) => {
  try {
    const { oldPassword, newPassword } = data;
    const res = await VerifyToken(token);
    const id = JSON.parse(JSON.stringify(res)).user._id;
    let user = await User.findById(id).select("+password");
    if (!user) {
      return new GraphQLError("No user found, please login to contnue.");
    }
    const isPassOk = compareSync(oldPassword, user.password);
    if (!isPassOk) {
      return new GraphQLError("Password didn't matched.");
    }
    if (oldPassword.toString() === newPassword.toString()) {
      return new GraphQLError("Old password and new password can't be same.");
    }
    user.password = newPassword;
    await user.save();
    return "Password updated successfully.";
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const updateProfile = async (data) => {
  try {
    const { token, details } = data;
    const res = await VerifyToken(token);
    const id = JSON.parse(JSON.stringify(res)).user._id;
    let user = await User.findByIdAndUpdate(
      { _id: id },
      { ...details },
      { new: true }
    );
    if (user) {
      console.log("UPdated User", user);
      return "Profile Updated successfully.";
    } else {
      return " Internal server error,Unable to update profile.";
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};

const sendOtp = async (email: string) => {
  try {
    const otp = GenerateOtp();
    const status = await sendEmail(email, "OTP VERIFICATION", otp);
    if (status) {
      return otp;
    } else {
      return new GraphQLError("Something went wrong, unable to send email");
    }
  } catch (error) {
    return new GraphQLError(error.message);
  }
};
// Update Profile function
export {
  createUser,
  loginUser,
  VerifyToken,
  updatePassword,
  updateProfile,
  sendOtp,
};
