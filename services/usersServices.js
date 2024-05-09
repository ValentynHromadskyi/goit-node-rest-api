import jsonWebToken from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const findUser = async (filter) => {
  const user = await User.findOne(filter);
  return user;
};

export const findUserById = async (_id) => {
  const user = await User.findById({ _id });
  return user;
};

const updateUserWithToken = async (id) => {
  const { SECRET_KEY } = process.env;
  const token = jsonWebToken.sign({ id }, SECRET_KEY);
  const user = await User.findByIdAndUpdate(id, { token }, { new: true });
  return user;
};

export const createUser = async (userData, verToken) => {
  const emailHash = crypto
    .createHash("md5")
    .update(userData.email)
    .digest("hex");

  const newUser = new User(userData);
  newUser.verificationToken = verToken;
  newUser.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=robohash `;
  await newUser.hashPassword();

  await newUser.save();
  const user = updateUserWithToken(newUser._id);
  return user;
};

export const comparePasswords = (password, hashedPassword) =>
  bcryptjs.compare(password, hashedPassword);

export const updateUser = (id, data) => User.findOneAndUpdate(id, data);
