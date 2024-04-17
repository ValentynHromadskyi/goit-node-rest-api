import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { findUserById } from "../services/usersServices.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1];

    if (!token) {
      return next(HttpError(401, "Not authorized"));
    }

    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    const currentUser = await findUserById(id);

    if (!currentUser) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = currentUser;

    next();
  } catch (err) {
    next(HttpError(401, "Not authorized"));
  }
};
