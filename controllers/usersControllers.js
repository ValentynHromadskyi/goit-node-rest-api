import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import {
  comparePasswords,
  createUser,
  findUser,
  findUserByEmail,
  updateUser,
} from "../services/usersServices.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

export const createNewUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    const verificationToken = nanoid();
    if (user) {
      throw HttpError(409, "user with this email is already registered");
    }
    const newUser = await createUser(req.body, verificationToken);

    const verifyEmail = {
      to: email,
      subject: "Verify Email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to confirm email address</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        verificationToken,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) throw HttpError(401, "Email or password is wrong");
    const passwordCompare = await comparePasswords(password, user.password);
    if (!user.verify) {
      throw HttpError(401, "Email isn't verified");
    }
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const { SECRET_KEY } = process.env;
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });

    await updateUser(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      throw HttpError(401, "Not authorized");
    }
    await updateUser(_id, { token: "" });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    if (!req.user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).json({
      email,
      subscription,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "The 'avatar' field with an image is required" });
  }
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;
  const extension = req.file.originalname.split(".").pop().toLowerCase();
  const avatarName = `${_id}.${extension}`;
  const avatarsDir = path.join("public", "avatars");
  const resultUpload = path.join(avatarsDir, avatarName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarName);

  const resizeImage = async () => {
    try {
      const image = await Jimp.read(resultUpload);
      await image.resize(250, 250).write(resultUpload);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  resizeImage();
  await updateUser(_id, { avatarURL });
  res.json({ avatarURL });
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await findUser({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await updateUser(
      { _id: user._id },
      { verify: true, verificationToken: " " }
    );

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const sendEmailVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank" >
    Click to confirm email address</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
