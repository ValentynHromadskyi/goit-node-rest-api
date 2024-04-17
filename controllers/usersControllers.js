import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import {
  comparePasswords,
  createUser,
  findUserByEmail,
  updateUser,
} from "../services/usersServices.js";

export const createNewUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (user) {
      throw HttpError(409, "user with this email is already registered");
    }
    const newUser = await createUser(req.body);
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
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
