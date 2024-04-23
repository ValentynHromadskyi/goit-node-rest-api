import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  { versionKey: false }
);

usersSchema.methods.hashPassword = async function () {
  this.password = await bcryptjs.hash(this.password, 10);
};

export const User = model("Users", usersSchema);
